import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PORTAL_COOKIE, verifyToken } from '@/lib/portalAuth';
import { createBillingPortalUrl, getDonorSummary } from '@/lib/donations';

// Opens the Stripe billing portal for the signed-in donor so they can manage
// their recurring gifts and payment methods.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const email = verifyToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }

  const summary = await getDonorSummary(email);
  if (!summary?.customerId) {
    return NextResponse.json({ ok: false, error: 'No billing account found.' }, { status: 404 });
  }

  const origin =
    request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const url = await createBillingPortalUrl(summary.customerId, `${origin}/portal`);
  if (!url) {
    return NextResponse.json({ ok: false, error: 'Could not open billing portal.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, url });
}
