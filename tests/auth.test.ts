import { describe, it, expect, beforeEach } from 'vitest';
import {
  adminConfigured,
  isValidSession,
  passwordMatches,
  sessionToken
} from '@/lib/adminAuth';

describe('adminAuth', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'correct horse battery';
  });

  it('reports configured when a password is set', () => {
    expect(adminConfigured()).toBe(true);
  });

  it('matches the exact password (timing-safe) and nothing else', () => {
    expect(passwordMatches('correct horse battery')).toBe(true);
    expect(passwordMatches('wrong')).toBe(false);
    expect(passwordMatches('correct horse batter')).toBe(false);
  });

  it('validates a genuine session token and rejects tampering', () => {
    const token = sessionToken();
    expect(token).toBeTruthy();
    expect(isValidSession(token as string)).toBe(true);
    expect(isValidSession(`${token}x`)).toBe(false);
    expect(isValidSession(undefined)).toBe(false);
    expect(isValidSession('')).toBe(false);
  });

  it('invalidates old sessions when the password changes', () => {
    const token = sessionToken();
    process.env.ADMIN_PASSWORD = 'a different password';
    expect(isValidSession(token as string)).toBe(false);
  });
});

describe('portalAuth (magic-link tokens)', () => {
  it('round-trips a session token and rejects tampering/expired/forged tokens', async () => {
    process.env.PORTAL_SECRET = 'portal-secret-value';
    // Import after setting env: the module reads the secret at load time.
    const { createSessionToken, verifyToken } = await import('@/lib/portalAuth');

    const token = createSessionToken('Donor@Example.com');
    expect(verifyToken(token)).toBe('donor@example.com'); // normalized to lowercase
    expect(verifyToken(`${token}tamper`)).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
    expect(verifyToken('not-a-real-token')).toBeNull();
  });

  it('rejects an expired magic token', async () => {
    process.env.PORTAL_SECRET = 'portal-secret-value';
    const mod = await import('@/lib/portalAuth');
    // A magic token is short-lived; simulate expiry by advancing time past its TTL.
    const realNow = Date.now;
    const token = mod.createMagicToken('a@b.com');
    Date.now = () => realNow() + 16 * 60 * 1000; // +16 min > 15 min TTL
    try {
      expect(mod.verifyToken(token)).toBeNull();
    } finally {
      Date.now = realNow;
    }
  });
});
