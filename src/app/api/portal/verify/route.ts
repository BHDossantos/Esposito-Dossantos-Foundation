import { NextResponse } from 'next/server';
import { createSessionToken, PORTAL_COOKIE, verifyToken } from '@/lib/portalAuth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') ?? undefined;
  const next = url.searchParams.get('next') || '/portal';

  const email = verifyToken(token);
  if (!email) {
    // Invalid/expired link → back to login with a flag.
    return NextResponse.redirect(new URL('/portal/login?error=link', url.origin));
  }

  // Only allow internal redirect targets.
  const safeNext = next.startsWith('/') ? next : '/portal';
  const res = NextResponse.redirect(new URL(safeNext, url.origin));
  res.cookies.set(PORTAL_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}
