-- Esposito–Dossantos Foundation — submissions store
-- Run once in the Supabase SQL editor, then set SUPABASE_URL +
-- SUPABASE_SERVICE_ROLE_KEY (and ADMIN_PASSWORD) in your environment.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,            -- newsletter | contact | rsvp | application
  category text,                   -- interest / inquiry type / event / volunteer | scholarship
  data jsonb not null,             -- full submitted payload
  status text not null default 'new', -- new | reviewing | accepted | declined | archived
  sequence_step int not null default 0, -- last email-sequence step sent
  received_at timestamptz not null default now()
);

-- If upgrading an existing table, add the newer columns:
-- alter table public.leads add column if not exists status text not null default 'new';
-- alter table public.leads add column if not exists sequence_step int not null default 0;

create index if not exists leads_received_at_idx on public.leads (received_at desc);
create index if not exists leads_source_idx on public.leads (source);

-- The service role key bypasses RLS, so the server can read/write. Keep RLS on
-- and add no public policies: only the server (service role) may access this.
alter table public.leads enable row level security;

-- One-time portal magic-link redemption. Apply and validate before enabling
-- PORTAL_ONE_TIME_LINKS_READY=true. Never remove unexpired rows or restore an
-- older ledger while the corresponding links can still be valid.
create table if not exists public.portal_consumed_tokens (
  token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null,
  consumed_at timestamptz not null default now()
);
alter table public.portal_consumed_tokens enable row level security;
revoke all on public.portal_consumed_tokens from public, anon, authenticated, service_role;
grant insert on public.portal_consumed_tokens to service_role;
-- Cleanup, if approved, must use a privileged maintenance role and delete only
-- rows past expires_at plus a clock-skew margin. No app delete/update privilege.
