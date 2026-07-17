import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createMagicToken, portalConfigured } from '@/lib/portalAuth';
import { emailConfigured, sendMagicLink } from '@/lib/email';

const schema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.string().trim().max(5).optional()
});

export async function POST(request: Request) {
  if (!portalConfigured()) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
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
  const token = createMagicToken(email);
  const origin =
    request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const prefix = locale && locale !== 'en' ? `/${locale}` : '';
  const link = `${origin}/api/portal/verify?token=${encodeURIComponent(token)}&next=${encodeURIComponent(prefix + '/portal')}`;

  if (emailConfigured()) {
    await sendMagicLink(email, link);
  } else {
    // Dev fallback: surface the link in server logs so it's testable without email.
    // eslint-disable-next-line no-console
    console.info('[portal] magic link (email not configured):', link);
  }

  // Always report success — never reveal whether an email is on file.
  return NextResponse.json({ ok: true, emailConfigured: emailConfigured() });
}
