-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.devices (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  lat        double precision,
  lng        double precision,
  accuracy   double precision,
  last_seen  timestamptz,
  lost       boolean not null default false,
  message    text not null default '',
  pin_hash   text not null default '',
  created_at timestamptz not null default now()
);

alter table public.devices enable row level security;

-- Prototype policies: anyone holding the public key can read and write.
-- Fine for a demo, NOT for real use (see "Honest limits" in the README).
create policy "demo read"   on public.devices for select using (true);
create policy "demo insert" on public.devices for insert with check (true);
create policy "demo update" on public.devices for update using (true) with check (true);
create policy "demo delete" on public.devices for delete using (true);
