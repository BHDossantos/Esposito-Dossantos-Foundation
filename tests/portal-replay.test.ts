import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('PORTAL_SECRET', 'replay-test-secret');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://foundation.example');
  vi.stubEnv('SUPABASE_URL', 'https://storage.example');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-key');
  vi.stubEnv('PORTAL_ONE_TIME_LINKS_READY', 'true');
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); });
const request = (token: string) => new Request(`https://foundation.example/api/portal/verify?token=${encodeURIComponent(token)}`);

// Contract double for the database's atomic primary-key insert, not evidence
// that a deployed PostgreSQL table or its permissions have been validated.
function uniqueInsert() {
  const rows = new Set<string>();
  const fetch = vi.fn(async (_url: unknown, options: RequestInit) => {
    await Promise.resolve();
    const row = JSON.parse(options.body as string);
    if (rows.has(row.token_hash)) return new Response(null, { status: 409 });
    rows.add(row.token_hash);
    return new Response(null, { status: 201 });
  });
  vi.stubGlobal('fetch', fetch);
  return { rows, fetch };
}

describe('durable magic-link consumption contract', () => {
  it('allows only one concurrent callback and rejects replay across module reloads and token encoding aliases', async () => {
    const db = uniqueInsert();
    const { createMagicToken, verifyToken } = await import('@/lib/portalAuth');
    const token = createMagicToken('donor@example.com');
    const { GET } = await import('@/app/api/portal/verify/route');
    const responses = await Promise.all(Array.from({ length: 20 }, () => GET(request(token))));
    expect(responses.filter(r => r.headers.has('set-cookie'))).toHaveLength(1);
    expect(db.rows.size).toBe(1);
    const winner = responses.find(r => r.headers.has('set-cookie'))!;
    const session = winner.cookies.get('edf_portal')!.value;
    expect(verifyToken(session)).toBe('donor@example.com');
    expect(winner.headers.get('cache-control')).toBe('no-store');
    vi.resetModules();
    const otherInstance = await import('@/app/api/portal/verify/route');
    expect((await otherInstance.GET(request(token + '=='))).headers.has('set-cookie')).toBe(false);
    const [url, options] = db.fetch.mock.calls[0];
    expect(url).toBe('https://storage.example/rest/v1/portal_consumed_tokens');
    expect(options.method).toBe('POST');
    expect(options.headers).toMatchObject({ Prefer: 'return=minimal' });
    const body = JSON.parse(options.body as string);
    expect(body.token_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(options.body).not.toContain('donor@example.com');
    expect(options.body).not.toContain(token);
  });
  it('issues distinct links even to the same mailbox at the same instant', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-06T00:00:00Z'));
    const { createMagicToken } = await import('@/lib/portalAuth');
    expect(createMagicToken('a@b.com')).not.toBe(createMagicToken('a@b.com'));
  });
  it.each([401, 403, 404, 500, 200, 204])('never creates a cookie for storage status %s', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })));
    const { createMagicToken } = await import('@/lib/portalAuth');
    const { GET } = await import('@/app/api/portal/verify/route');
    const result = await GET(request(createMagicToken('a@b.com')));
    expect(result.status).toBe(503); expect(result.headers.has('set-cookie')).toBe(false);
  });
  it('fails closed after ambiguous commit and never retries or mints a cookie on replay', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error('response lost after commit'))
      .mockResolvedValue(new Response(null, { status: 409 }));
    vi.stubGlobal('fetch', fetch);
    const { createMagicToken } = await import('@/lib/portalAuth');
    const { GET } = await import('@/app/api/portal/verify/route');
    const token = createMagicToken('a@b.com');
    expect((await GET(request(token))).status).toBe(503);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect((await GET(request(token))).headers.has('set-cookie')).toBe(false);
  });
  it('rejects invalid, expired, and session tokens before storage', async () => {
    const db = uniqueInsert();
    const auth = await import('@/lib/portalAuth');
    const { GET } = await import('@/app/api/portal/verify/route');
    const token = auth.createMagicToken('a@b.com');
    vi.useFakeTimers(); vi.setSystemTime(Date.now() + 15 * 60 * 1000);
    for (const value of [token, token + 'bad', auth.createSessionToken('a@b.com')]) {
      expect((await GET(request(value))).headers.has('set-cookie')).toBe(false);
    }
    expect(db.fetch).not.toHaveBeenCalled();
  });
  it('does not extend expiration while waiting for storage', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-06T00:00:00Z'));
    vi.stubGlobal('fetch', vi.fn(async () => {
      vi.setSystemTime(Date.now() + 15 * 60 * 1000);
      return new Response(null, { status: 201 });
    }));
    const { createMagicToken } = await import('@/lib/portalAuth');
    const { GET } = await import('@/app/api/portal/verify/route');
    expect((await GET(request(createMagicToken('a@b.com')))).headers.has('set-cookie')).toBe(false);
  });
  it('requires explicit storage readiness and configuration', async () => {
    const db = uniqueInsert();
    vi.stubEnv('PORTAL_ONE_TIME_LINKS_READY', 'false');
    const auth = await import('@/lib/portalAuth');
    const { GET } = await import('@/app/api/portal/verify/route');
    const result = await GET(request(auth.createMagicToken('a@b.com')));
    expect(result.status).toBe(503); expect(result.headers.has('set-cookie')).toBe(false);
    expect(db.fetch).not.toHaveBeenCalled();
  });
});
