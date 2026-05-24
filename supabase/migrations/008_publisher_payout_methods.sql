create table if not exists public.publisher_payout_methods (
  id             uuid        primary key default gen_random_uuid(),
  publisher_id   uuid        not null unique references public.publishers(id) on delete cascade,
  method         text        not null check (method in ('paypal', 'wise', 'bank')),
  -- PayPal / Wise
  email          text,
  -- Bank transfer
  account_holder text,
  account_number text,
  swift_bic      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.publisher_payout_methods enable row level security;

create policy "publishers_select_own_payout"
  on public.publisher_payout_methods for select
  using (
    publisher_id in (select id from public.publishers where user_id = auth.uid())
  );

create policy "publishers_upsert_own_payout"
  on public.publisher_payout_methods for insert
  with check (
    publisher_id in (select id from public.publishers where user_id = auth.uid())
  );

create policy "publishers_update_own_payout"
  on public.publisher_payout_methods for update
  using (
    publisher_id in (select id from public.publishers where user_id = auth.uid())
  );
