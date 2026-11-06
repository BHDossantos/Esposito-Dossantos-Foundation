import { createHash, createHmac, randomUUID, timingSafeEqual } from 'crypto';

// Passwordless donor auth via signed, expiring tokens. A magic-link token
// (short TTL) is emailed; verifying it mints a longer-lived session token. Both
// are HMAC-signed with PORTAL_SECRET (falls back to ADMIN_PASSWORD) so they
// can't be forged.
const SECRET = process.env.PORTAL_SECRET || process.env.ADMIN_PASSWORD || '';

export const PORTAL_COOKIE = 'edf_portal';
const MAGIC_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function portalConfigured(): boolean {
  return Boolean(SECRET);
}

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

type Purpose = 'magic' | 'session';

function encode(email: string, exp: number, purpose: Purpose): string {
  const payload = `${purpose}|${email}|${exp}${purpose === 'magic' ? `|${randomUUID()}` : ''}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}|${sig}`).toString('base64url');
}

function decode(token: string, expectedPurpose: Purpose): { email: string; exp: number; digest: string } | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const idx = raw.lastIndexOf('|');
    if (idx < 0) return null;
    const payload = raw.slice(0, idx);
    const sig = raw.slice(idx + 1);
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const [purpose, email, expStr, nonce, extra] = payload.split('|');
    if (purpose !== expectedPurpose || extra !== undefined) return null;
    if (purpose === 'session' ? nonce !== undefined : !nonce || !/^[0-9a-f-]{36}$/.test(nonce)) return null;
    const exp = Number(expStr);
    if (!email || !Number.isFinite(exp) || exp <= Date.now()) return null;
    // Hash the decoded signed bytes, not the base64 spelling (padding aliases exist).
    return { email, exp, digest: createHash('sha256').update(raw).digest('hex') };
  } catch {
    return null;
  }
}

export function createMagicToken(email: string): string {
  return encode(email.toLowerCase(), Date.now() + MAGIC_TTL_MS, 'magic');
}

export function createSessionToken(email: string): string {
  return encode(email.toLowerCase(), Date.now() + SESSION_TTL_MS, 'session');
}

/** Returns the verified email, or null if the token is invalid/expired. */
export function verifyToken(token: string | undefined, purpose: Purpose = 'session'): string | null {
  if (!SECRET || !token) return null;
  return decode(token, purpose)?.email ?? null;
}

/** Only this operation may authorize a magic-link session. Verification alone
 * proves authenticity, not single use. Session cookies remain stateless. */
export async function consumeMagicToken(token: string | undefined): Promise<string | null> {
  if (!SECRET || !token) return null;
  const verified = decode(token, 'magic');
  if (!verified) return null;
  const { claimMagicLink } = await import('./portalTokenStore');
  if (!await claimMagicLink(verified.digest, verified.exp)) return null;
  // A slow storage request must not extend the link's expiry.
  return verified.exp > Date.now() ? verified.email : null;
}
