// Server-only consumed-token ledger. One plain INSERT, never an upsert or a
// read-then-write: the database primary key arbitrates concurrent redemption.
export function magicLinkStoreConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.PORTAL_ONE_TIME_LINKS_READY === 'true');
}

export async function claimMagicLink(digest: string, expiresAt: number): Promise<boolean> {
  if (!magicLinkStoreConfigured()) throw new Error('Magic-link storage unavailable');
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/portal_consumed_tokens`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ token_hash: digest, expires_at: new Date(expiresAt).toISOString() }),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5000)
  });
  if (response.status === 201) return true;
  if (response.status === 409) return false; // Unique-key conflict: already consumed.
  // Missing schema, permissions, outages, or ambiguous replies never mint cookies.
  // Do not retry: a timed-out INSERT may already have committed.
  throw new Error('Magic-link storage unavailable');
}
