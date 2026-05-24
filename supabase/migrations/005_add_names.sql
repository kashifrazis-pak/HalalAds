alter table public.campaigns  add column if not exists name text;
alter table public.ad_units   add column if not exists name text;
alter table public.publishers add column if not exists site_name text;
