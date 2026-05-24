-- =============================================================================
-- Islamic Ad Network — Row Level Security Policies
-- Migration: 002_rls_policies
-- Run AFTER 001_initial_schema.sql
-- =============================================================================

-- Enable RLS on all tables
alter table public.users        enable row level security;
alter table public.advertisers  enable row level security;
alter table public.publishers   enable row level security;
alter table public.campaigns    enable row level security;
alter table public.ad_creatives enable row level security;
alter table public.ad_units     enable row level security;
alter table public.impressions  enable row level security;
alter table public.clicks       enable row level security;
alter table public.waitlist     enable row level security;

-- =============================================================================
-- USERS
-- Users can read and update only their own row.
-- =============================================================================
create policy "users: read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "users: update own row"
  on public.users for update
  using (auth.uid() = id);

-- =============================================================================
-- ADVERTISERS
-- Advertisers can only read/update their own profile.
-- =============================================================================
create policy "advertisers: read own profile"
  on public.advertisers for select
  using (auth.uid() = user_id);

create policy "advertisers: update own profile"
  on public.advertisers for update
  using (auth.uid() = user_id);

create policy "advertisers: insert own profile"
  on public.advertisers for insert
  with check (auth.uid() = user_id);

-- =============================================================================
-- PUBLISHERS
-- Publishers can only read/update their own profile.
-- =============================================================================
create policy "publishers: read own profile"
  on public.publishers for select
  using (auth.uid() = user_id);

create policy "publishers: update own profile"
  on public.publishers for update
  using (auth.uid() = user_id);

create policy "publishers: insert own profile"
  on public.publishers for insert
  with check (auth.uid() = user_id);

-- =============================================================================
-- CAMPAIGNS
-- Advertisers can only see and manage their own campaigns.
-- =============================================================================
create policy "campaigns: advertiser reads own"
  on public.campaigns for select
  using (
    advertiser_id in (
      select id from public.advertisers where user_id = auth.uid()
    )
  );

create policy "campaigns: advertiser inserts own"
  on public.campaigns for insert
  with check (
    advertiser_id in (
      select id from public.advertisers where user_id = auth.uid()
    )
  );

create policy "campaigns: advertiser updates own"
  on public.campaigns for update
  using (
    advertiser_id in (
      select id from public.advertisers where user_id = auth.uid()
    )
  );

-- =============================================================================
-- AD CREATIVES
-- Accessible by the campaign owner.
-- =============================================================================
create policy "ad_creatives: advertiser reads own"
  on public.ad_creatives for select
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.advertisers a on a.id = c.advertiser_id
      where a.user_id = auth.uid()
    )
  );

create policy "ad_creatives: advertiser inserts own"
  on public.ad_creatives for insert
  with check (
    campaign_id in (
      select c.id from public.campaigns c
      join public.advertisers a on a.id = c.advertiser_id
      where a.user_id = auth.uid()
    )
  );

-- =============================================================================
-- AD UNITS
-- Publishers can only see and manage their own ad units.
-- =============================================================================
create policy "ad_units: publisher reads own"
  on public.ad_units for select
  using (
    publisher_id in (
      select id from public.publishers where user_id = auth.uid()
    )
  );

create policy "ad_units: publisher inserts own"
  on public.ad_units for insert
  with check (
    publisher_id in (
      select id from public.publishers where user_id = auth.uid()
    )
  );

create policy "ad_units: publisher updates own"
  on public.ad_units for update
  using (
    publisher_id in (
      select id from public.publishers where user_id = auth.uid()
    )
  );

-- =============================================================================
-- IMPRESSIONS
-- Advertisers can read impressions for their campaigns.
-- Publishers can read impressions for their ad units.
-- Inserts are done via the service role (API route) — not by authenticated users directly.
-- =============================================================================
create policy "impressions: advertiser reads own"
  on public.impressions for select
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.advertisers a on a.id = c.advertiser_id
      where a.user_id = auth.uid()
    )
  );

create policy "impressions: publisher reads own"
  on public.impressions for select
  using (
    ad_unit_id in (
      select u.id from public.ad_units u
      join public.publishers p on p.id = u.publisher_id
      where p.user_id = auth.uid()
    )
  );

-- =============================================================================
-- CLICKS
-- Same read access as impressions.
-- =============================================================================
create policy "clicks: advertiser reads own"
  on public.clicks for select
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.advertisers a on a.id = c.advertiser_id
      where a.user_id = auth.uid()
    )
  );

-- =============================================================================
-- WAITLIST
-- No public read. Insert is public (unauthenticated signup).
-- Reads are admin-only (via service role key — bypasses RLS).
-- =============================================================================
create policy "waitlist: public insert"
  on public.waitlist for insert
  with check (true);

-- No select policy = authenticated users cannot read waitlist rows.
-- Service role key (used in API routes) bypasses RLS entirely.
