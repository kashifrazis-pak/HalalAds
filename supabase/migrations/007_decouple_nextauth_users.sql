-- Remove FK to auth.users — NextAuth manages auth, not Supabase Auth
alter table public.users drop constraint if exists users_id_fkey;

-- Allow role to be null until the user completes onboarding
alter table public.users drop constraint if exists users_role_check;
alter table public.users alter column role drop not null;
alter table public.users alter column role set default null;
alter table public.users add constraint users_role_check
  check (role in ('advertiser', 'publisher', 'admin') or role is null);

-- Store the NextAuth JWT sub (e.g. Google user ID) so we can link sessions to DB rows
alter table public.users add column if not exists nextauth_sub text;
create unique index if not exists idx_users_nextauth_sub
  on public.users(nextauth_sub) where nextauth_sub is not null;
