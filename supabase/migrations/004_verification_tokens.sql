-- NextAuth v5 magic link verification tokens
create table if not exists public.verification_tokens (
  identifier  text        not null,
  token       text        not null,
  expires     timestamptz not null,
  primary key (identifier, token)
);

-- Only the service role can read/write verification tokens (never the client)
alter table public.verification_tokens enable row level security;

-- No public policies — all access via service role key only
