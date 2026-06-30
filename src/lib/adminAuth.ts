import { createHmac, timingSafeEqual } from 'crypto';

// Lightweight admin session: a signed token derived from ADMIN_PASSWORD. The
// cookie can't be forged without knowing the password, and no secret beyond the
// password itself needs to be configured.
export const ADMIN_COOKIE = 'edf_admin';

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function sessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac('sha256', password).update('edf-admin-session-v1').digest('hex');
}

export function passwordMatches(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const expected = sessionToken();
  if (!expected || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
