-- Esposito–Dossantos Foundation — submissions store
-- Run once in the Supabase SQL editor, then set SUPABASE_URL +
-- SUPABASE_SERVICE_ROLE_KEY (and ADMIN_PASSWORD) in your environment.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,            -- newsletter | contact | rsvp | application
  category text,                   -- interest / inquiry type / event / volunteer | scholarship
  data jsonb not null,             -- full submitted payload
  received_at timestamptz not null default now()
);

create index if not exists leads_received_at_idx on public.leads (received_at desc);
create index if not exists leads_source_idx on public.leads (source);

-- The service role key bypasses RLS, so the server can read/write. Keep RLS on
-- and add no public policies: only the server (service role) may access this.
alter table public.leads enable row level security;
