import { NextResponse } from 'next/server';
import { createSessionToken, PORTAL_COOKIE, consumeMagicToken } from '@/lib/portalAuth';
import { siteOrigin, safeInternalPath } from '@/lib/siteOrigin';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') ?? undefined;
  const next = url.searchParams.get('next') || '/portal';

  const origin = siteOrigin();
  let email: string | null;
  try {
    email = await consumeMagicToken(token);
  } catch {
    return NextResponse.json({ ok: false, error: 'Sign-in is temporarily unavailable. Request a new link if this persists.' },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  }
  if (!email) {
    // Invalid/expired link → back to login with a flag.
    return NextResponse.redirect(new URL('/portal/login?error=link', origin));
  }

  // Only allow internal redirect targets.
  const res = NextResponse.redirect(new URL(safeInternalPath(next), origin));
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('Referrer-Policy', 'no-referrer');
  res.cookies.set(PORTAL_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}
