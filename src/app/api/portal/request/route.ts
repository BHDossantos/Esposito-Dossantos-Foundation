import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createMagicToken, portalConfigured } from '@/lib/portalAuth';
import { emailConfigured, sendMagicLink } from '@/lib/email';
import { siteOrigin, safeInternalPath } from '@/lib/siteOrigin';

import { magicLinkStoreConfigured } from '@/lib/portalTokenStore';

const schema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(['en', 'pt', 'it', 'es']).optional(),
  // Post-login destination (must be an internal path).
  next: z.string().trim().max(80).optional()
});

export async function POST(request: Request) {
  if (!portalConfigured() || !emailConfigured() || !magicLinkStoreConfigured()) {
    return NextResponse.json({ ok: false, error: 'Sign-in is temporarily unavailable.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 422 });
  }

  const { email, locale } = parsed.data;
  try {
    const dest = safeInternalPath(parsed.data.next);
    const token = createMagicToken(email);
    const origin = siteOrigin();
    const prefix = locale && locale !== 'en' ? `/${locale}` : '';
    const link = `${origin}/api/portal/verify?token=${encodeURIComponent(token)}&next=${encodeURIComponent(prefix + dest)}`;
    if (!await sendMagicLink(email, link)) throw new Error('Delivery unavailable');
  } catch {
    return NextResponse.json({ ok: false, error: 'Sign-in is temporarily unavailable.' }, { status: 503 });
  }

  // Provider acceptance is independent of whether the mailbox has gifts.
  return NextResponse.json({ ok: true });
}
