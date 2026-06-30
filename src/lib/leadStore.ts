import type { Lead } from './leads';

// Optional persistence layer. When SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are
// set, leads are stored in (and read from) a `leads` table via the Supabase
// REST API — no SDK dependency required. When unset, persistence is a no-op and
// the admin dashboard shows a setup state.
//
// Expected table (run once in Supabase SQL editor):
//   create table leads (
//     id uuid primary key default gen_random_uuid(),
//     source text not null,
//     category text,
//     data jsonb not null,
//     received_at timestamptz not null default now()
//   );

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function storeConfigured(): boolean {
  return Boolean(URL && KEY);
}

export type StoredLead = {
  id: string;
  source: string;
  category: string | null;
  data: Record<string, unknown>;
  received_at: string;
};

export async function saveLead(lead: Lead): Promise<boolean> {
  if (!storeConfigured()) return false;
  try {
    const res = await fetch(`${URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: KEY as string,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        source: lead.source,
        category: lead.category,
        data: lead.data,
        received_at: lead.receivedAt
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function listLeads(limit = 500): Promise<StoredLead[] | null> {
  if (!storeConfigured()) return null;
  try {
    const res = await fetch(
      `${URL}/rest/v1/leads?select=*&order=received_at.desc&limit=${limit}`,
      {
        headers: {
          apikey: KEY as string,
          Authorization: `Bearer ${KEY}`
        },
        cache: 'no-store'
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as StoredLead[];
  } catch {
    return null;
  }
}
