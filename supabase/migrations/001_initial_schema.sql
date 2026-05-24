-- =============================================================================
-- Islamic Ad Network — Initial Schema
-- Migration: 001_initial_schema
-- Run in: Supabase SQL Editor (staging first, then production)
-- =============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================================================
-- USERS
-- Mirrors auth.users from Supabase Auth. Stores app-level role.
-- =============================================================================
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  role        text not null check (role in ('advertiser', 'publisher', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.users is 'App-level user profile linked to Supabase Auth';

-- =============================================================================
-- ADVERTISERS
-- One row per advertiser account.
-- =============================================================================
create table if not exists public.advertisers (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null unique references public.users(id) on delete cascade,
  company_name  text not null default '',
  website       text,
  industry      text,
  balance       bigint not null default 0,  -- in cents (USD)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column public.advertisers.balance is 'Prepaid credit balance in USD cents';

-- =============================================================================
-- PUBLISHERS
-- One row per publisher account.
-- =============================================================================
create table if not exists public.publishers (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null unique references public.users(id) on delete cascade,
  display_name    text not null default '',
  site_url        text,
  verified        boolean not null default false,
  revenue_share   numeric(4,3) not null default 0.700,  -- 70% to publisher
  pending_payout  bigint not null default 0,             -- in cents
  total_earned    bigint not null default 0,             -- in cents
  payout_method   text check (payout_method in ('paypal', 'wise', 'bank', null)),
  payout_details  jsonb,                                 -- encrypted at app level before storing
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on column public.publishers.revenue_share is '0.700 = 70% share. Updated per contract.';

-- =============================================================================
-- CAMPAIGNS
-- Advertiser campaigns. targeting_json stores geo + interest filters.
-- =============================================================================
create table if not exists public.campaigns (
  id              uuid primary key default uuid_generate_v4(),
  advertiser_id   uuid not null references public.advertisers(id) on delete cascade,
  name            text not null,
  type            text not null check (type in ('cpc', 'cpm', 'cpa')),
  status          text not null default 'draft' check (status in ('draft', 'pending_review', 'active', 'paused', 'completed', 'rejected')),
  daily_budget    bigint not null default 0,   -- cents
  total_budget    bigint not null default 0,   -- cents
  spend           bigint not null default 0,   -- cents, updated on each impression/click
  bid_amount      bigint not null default 0,   -- cents per click (CPC) or per 1000 (CPM)
  targeting_json  jsonb not null default '{}', -- {countries: [], interests: []}
  start_date      date,
  end_date        date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on column public.campaigns.targeting_json is 'JSON: {countries: ["ID","MY"], interests: ["Islamic Finance"]}';

-- =============================================================================
-- AD CREATIVES
-- One creative per campaign (v1). Multiple creatives per campaign (v2).
-- =============================================================================
create table if not exists public.ad_creatives (
  id              uuid primary key default uuid_generate_v4(),
  campaign_id     uuid not null references public.campaigns(id) on delete cascade,
  headline        text not null,
  description     text,
  destination_url text not null,
  cta_text        text not null default 'Learn More',
  image_url       text,    -- Supabase Storage URL, null for text-only ads
  size            text not null default '300x250',
  created_at      timestamptz not null default now()
);

-- =============================================================================
-- AD UNITS
-- Publisher ad unit placements. Each generates a unique embed snippet.
-- =============================================================================
create table if not exists public.ad_units (
  id            uuid primary key default uuid_generate_v4(),
  publisher_id  uuid not null references public.publishers(id) on delete cascade,
  name          text not null,
  site_url      text not null,
  size          text not null default '300x250',
  placement     text not null default 'in-content' check (placement in ('header', 'in-content', 'sidebar', 'footer', 'interstitial')),
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- =============================================================================
-- IMPRESSIONS
-- One row per ad served. High-volume table — kept lean.
-- ip_hash is SHA-256(ip + daily_salt) — never store raw IPs.
-- =============================================================================
create table if not exists public.impressions (
  id            uuid primary key default uuid_generate_v4(),
  campaign_id   uuid not null references public.campaigns(id),
  ad_unit_id    uuid references public.ad_units(id),
  creative_id   uuid references public.ad_creatives(id),
  ip_hash       text,     -- hashed, not raw
  country       char(2),  -- ISO 3166-1 alpha-2
  user_agent    text,
  timestamp     timestamptz not null default now()
);

comment on column public.impressions.ip_hash is 'SHA-256(ip + YYYYMMDD salt). Never raw IP.';

-- =============================================================================
-- CLICKS
-- One row per verified click. Links back to the impression.
-- =============================================================================
create table if not exists public.clicks (
  id            uuid primary key default uuid_generate_v4(),
  impression_id uuid references public.impressions(id),
  campaign_id   uuid not null references public.campaigns(id),
  ip_hash       text,
  timestamp     timestamptz not null default now()
);

-- =============================================================================
-- WAITLIST
-- Pre-launch signups. Separate from users — these people haven't signed up yet.
-- =============================================================================
create table if not exists public.waitlist (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null unique,
  type        text not null check (type in ('advertiser', 'publisher')),
  company     text,
  source      text default 'website',  -- track where signup came from
  created_at  timestamptz not null default now()
);

comment on table public.waitlist is 'Pre-launch interest signups. Not linked to auth.users.';

-- =============================================================================
-- INDEXES
-- Critical for query performance on high-volume tables.
-- =============================================================================

-- Campaigns: fetch active campaigns for ad serving
create index if not exists idx_campaigns_advertiser_id on public.campaigns(advertiser_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_status_type on public.campaigns(status, type);

-- Impressions: analytics queries by campaign and time
create index if not exists idx_impressions_campaign_id on public.impressions(campaign_id);
create index if not exists idx_impressions_timestamp on public.impressions(timestamp desc);
create index if not exists idx_impressions_campaign_timestamp on public.impressions(campaign_id, timestamp desc);
create index if not exists idx_impressions_ad_unit_id on public.impressions(ad_unit_id);

-- Clicks: CTR calculation and fraud detection
create index if not exists idx_clicks_campaign_id on public.clicks(campaign_id);
create index if not exists idx_clicks_impression_id on public.clicks(impression_id);
create index if not exists idx_clicks_timestamp on public.clicks(timestamp desc);
create index if not exists idx_clicks_ip_hash_timestamp on public.clicks(ip_hash, timestamp desc);

-- Ad units: serve requests look up by unit
create index if not exists idx_ad_units_publisher_id on public.ad_units(publisher_id);
create index if not exists idx_ad_units_active on public.ad_units(active);

-- Waitlist: duplicate check
create index if not exists idx_waitlist_email on public.waitlist(email);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- Auto-updates updated_at on any row change.
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger set_advertisers_updated_at
  before update on public.advertisers
  for each row execute function public.set_updated_at();

create trigger set_publishers_updated_at
  before update on public.publishers
  for each row execute function public.set_updated_at();

create trigger set_campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.set_updated_at();
