create table if not exists public.billing_transactions (
  id                       uuid        primary key default gen_random_uuid(),
  advertiser_id            uuid        not null references public.advertisers(id) on delete cascade,
  type                     text        not null check (type in ('topup', 'spend')),
  amount_cents             integer     not null,
  credits                  integer     not null default 0,
  description              text,
  stripe_payment_intent_id text,
  created_at               timestamptz not null default now()
);

alter table public.billing_transactions enable row level security;

create policy "advertisers_select_own_transactions"
  on public.billing_transactions for select
  using (
    advertiser_id in (select id from public.advertisers where user_id = auth.uid())
  );
