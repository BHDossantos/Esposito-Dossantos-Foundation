import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_COOKIE, adminConfigured, passwordMatches, sessionToken } from '@/lib/adminAuth';

const schema = z.object({ password: z.string().min(1).max(500) });

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success || !passwordMatches(parsed.data.password)) {
    return NextResponse.json({ ok: false, error: 'Invalid password.' }, { status: 401 });
  }

  const token = sessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  return res;
}
