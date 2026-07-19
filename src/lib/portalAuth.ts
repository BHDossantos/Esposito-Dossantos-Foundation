import { createHmac, timingSafeEqual } from 'crypto';

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

function encode(email: string, exp: number): string {
  const payload = `${email}|${exp}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}|${sig}`).toString('base64url');
}

function decode(token: string): { email: string; exp: number } | null {
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
    const [email, expStr] = payload.split('|');
    const exp = Number(expStr);
    if (!email || !Number.isFinite(exp) || exp < Date.now()) return null;
    return { email, exp };
  } catch {
    return null;
  }
}

export function createMagicToken(email: string): string {
  return encode(email.toLowerCase(), Date.now() + MAGIC_TTL_MS);
}

export function createSessionToken(email: string): string {
  return encode(email.toLowerCase(), Date.now() + SESSION_TTL_MS);
}

/** Returns the verified email, or null if the token is invalid/expired. */
export function verifyToken(token: string | undefined): string | null {
  if (!SECRET || !token) return null;
  return decode(token)?.email ?? null;
}
