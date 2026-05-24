-- =============================================================================
-- Islamic Ad Network — Auth User Sync Trigger
-- Migration: 003_auth_trigger
-- Run AFTER 001 and 002.
--
-- When a user signs up via Supabase Auth (Google OAuth or magic link),
-- this trigger automatically creates a row in public.users.
-- The role defaults to 'advertiser' — the onboarding flow lets users switch.
-- =============================================================================

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'role',
      'advertiser'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Fire after every new auth user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- =============================================================================
-- FUNCTION: create_advertiser_profile
-- Called from the app after a user confirms they are an advertiser.
-- Creates the advertisers row if it doesn't exist yet.
-- =============================================================================
create or replace function public.ensure_advertiser_profile(p_user_id uuid, p_company_name text default '')
returns uuid as $$
declare
  v_id uuid;
begin
  insert into public.advertisers (user_id, company_name)
  values (p_user_id, p_company_name)
  on conflict (user_id) do nothing
  returning id into v_id;

  if v_id is null then
    select id into v_id from public.advertisers where user_id = p_user_id;
  end if;

  -- Update the user's role
  update public.users set role = 'advertiser' where id = p_user_id;

  return v_id;
end;
$$ language plpgsql security definer;

-- =============================================================================
-- FUNCTION: create_publisher_profile
-- Called from the app after a user confirms they are a publisher.
-- =============================================================================
create or replace function public.ensure_publisher_profile(p_user_id uuid, p_display_name text default '', p_site_url text default '')
returns uuid as $$
declare
  v_id uuid;
begin
  insert into public.publishers (user_id, display_name, site_url)
  values (p_user_id, p_display_name, p_site_url)
  on conflict (user_id) do nothing
  returning id into v_id;

  if v_id is null then
    select id into v_id from public.publishers where user_id = p_user_id;
  end if;

  -- Update the user's role
  update public.users set role = 'publisher' where id = p_user_id;

  return v_id;
end;
$$ language plpgsql security definer;
