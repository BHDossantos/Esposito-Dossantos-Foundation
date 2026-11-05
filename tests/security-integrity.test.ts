import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { siteOrigin, safeInternalPath } from '@/lib/siteOrigin';

const email = vi.hoisted(() => ({ emailConfigured: vi.fn(), sendMagicLink: vi.fn(), sendEmail: vi.fn() }));
const store = vi.hoisted(() => ({ saveLead: vi.fn() }));
vi.mock('@/lib/email', () => email);
vi.mock('@/lib/leadStore', () => store);

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('PORTAL_SECRET', 'test-only-secret');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://foundation.example');
  email.emailConfigured.mockReturnValue(true);
  email.sendMagicLink.mockResolvedValue(true);
  email.sendEmail.mockResolvedValue(true);
  store.saveLead.mockResolvedValue(true);
});
afterEach(() => vi.unstubAllEnvs());

const request = (body: unknown) => new Request('https://attacker.invalid/api/portal/request', {
  method: 'POST', headers: { origin: 'https://attacker.invalid', 'content-type': 'application/json' },
  body: JSON.stringify(body)
});

describe('canonical links', () => {
  it.each(['//evil.example', '/\\evil.example', '/%2f%2fevil.example', '/\nevil', 'https://evil.example'])('rejects external or ambiguous target %s', (path) => {
    expect(safeInternalPath(path)).toBe('/portal');
  });
  it('preserves safe internal navigation', () => expect(safeInternalPath('/sponsors?year=2026')).toBe('/sponsors?year=2026'));
  it.each(['https://site.example/path', 'https://user:pass@site.example', 'javascript:evil', 'http://external.example'])('rejects invalid canonical configuration %s', (value) => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', value);
    expect(() => siteOrigin()).toThrow();
  });
  it('does not allow production HTTP even on localhost', () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
    expect(() => siteOrigin()).toThrow();
  });
  it('emails only the canonical origin and safe path', async () => {
    const { POST } = await import('@/app/api/portal/request/route');
    const response = await POST(request({ email: 'donor@example.com', next: '//evil.example' }));
    expect(response.status).toBe(200);
    const url = new URL(email.sendMagicLink.mock.calls[0][1]);
    expect(url.origin).toBe('https://foundation.example');
    expect(url.searchParams.get('next')).toBe('/portal');
  });
  it('does not log or mint a usable link when mail is absent', async () => {
    email.emailConfigured.mockReturnValue(false);
    const log = vi.spyOn(console, 'info');
    const { POST } = await import('@/app/api/portal/request/route');
    expect((await POST(request({ email: 'donor@example.com' }))).status).toBe(503);
    expect(email.sendMagicLink).not.toHaveBeenCalled(); expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });
  it('reports provider failure instead of a false sent result', async () => {
    email.sendMagicLink.mockResolvedValue(false);
    const { POST } = await import('@/app/api/portal/request/route');
    expect((await POST(request({ email: 'donor@example.com' }))).status).toBe(503);
  });
  it('never accepts a session token as a magic token or vice versa', async () => {
    const auth = await import('@/lib/portalAuth');
    const magic = auth.createMagicToken('a@example.com');
    const session = auth.createSessionToken('a@example.com');
    expect(auth.verifyToken(magic, 'magic')).toBe('a@example.com');
    expect(auth.verifyToken(magic)).toBeNull();
    expect(auth.verifyToken(session, 'magic')).toBeNull();
    const { GET } = await import('@/app/api/portal/verify/route');
    const res = await GET(new Request(`https://evil.invalid/api/portal/verify?token=${session}&next=//evil.invalid`));
    expect(res.headers.get('location')).toBe('https://foundation.example/portal/login?error=link');
    expect(res.headers.get('set-cookie')).toBeNull();
  });
  it('valid magic callback stays canonical even with an external next', async () => {
    const auth = await import('@/lib/portalAuth');
    const { GET } = await import('@/app/api/portal/verify/route');
    const res = await GET(new Request(`https://evil.invalid/api/portal/verify?token=${auth.createMagicToken('a@example.com')}&next=//evil.invalid`));
    expect(res.headers.get('location')).toBe('https://foundation.example/portal');
    expect(res.headers.get('set-cookie')).toContain('HttpOnly');
  });
});

describe('durable intake', () => {
  it.each([false, new Error('unavailable')])('never acknowledges unsaved submissions', async (failure) => {
    if (failure instanceof Error) store.saveLead.mockRejectedValue(failure);
    else store.saveLead.mockResolvedValue(false);
    const log = vi.spyOn(console, 'info');
    const { POST } = await import('@/app/api/contact/route');
    const res = await POST(request({ name: 'Applicant', email: 'a@example.com', inquiryType: 'general', message: 'Private message' }));
    expect(res.status).toBe(500); expect((await res.json()).ok).toBe(false);
    expect(email.sendEmail).not.toHaveBeenCalled(); expect(log).not.toHaveBeenCalled(); log.mockRestore();
  });
  it('acknowledges saved intake despite a welcome email outage', async () => {
    email.sendEmail.mockRejectedValue(new Error('mail outage'));
    const { POST } = await import('@/app/api/newsletter/route');
    const res = await POST(request({ name: 'Donor', email: 'a@example.com', interest: 'donor' }));
    expect(res.status).toBe(200); expect(store.saveLead).toHaveBeenCalledOnce();
  });
});
