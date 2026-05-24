create table if not exists public.publisher_payouts (
  id               uuid        primary key default gen_random_uuid(),
  publisher_id     uuid        not null references public.publishers(id) on delete cascade,
  amount_cents     integer     not null check (amount_cents > 0),
  currency         text        not null default 'USD',
  method           text        not null check (method in ('paypal', 'wise', 'bank')),
  status           text        not null default 'pending'
                               check (status in ('pending', 'processing', 'paid', 'failed')),
  paypal_batch_id  text,
  paypal_item_id   text,
  period_start     date,
  period_end       date,
  failure_reason   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.publisher_payouts enable row level security;

create policy "publishers_select_own_payouts"
  on public.publisher_payouts for select
  using (
    publisher_id in (select id from public.publishers where user_id = auth.uid())
  );
