import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PORTAL_COOKIE, verifyToken } from '@/lib/portalAuth';
import { createBillingPortalUrl, getDonorSummary } from '@/lib/donations';
import { siteOrigin } from '@/lib/siteOrigin';

// Opens the Stripe billing portal for the signed-in donor so they can manage
// their recurring gifts and payment methods.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const email = verifyToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 });
  }

  const summary = await getDonorSummary(email);
  if (summary === null) {
    return NextResponse.json({ ok: false, error: 'Billing is temporarily unavailable.' }, { status: 503 });
  }
  if (!summary.customerIds.length) {
    return NextResponse.json({ ok: false, error: 'No billing account found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const customerId = body?.customerId ?? (summary.customerIds.length === 1 ? summary.customerIds[0] : null);
  if (typeof customerId !== 'string' || !summary.customerIds.includes(customerId)) {
    return NextResponse.json({ ok: false, error: 'Select one of your billing accounts.' }, { status: 400 });
  }
  const origin = siteOrigin();
  const url = await createBillingPortalUrl(customerId, `${origin}/portal`);
  if (!url) {
    return NextResponse.json({ ok: false, error: 'Could not open billing portal.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, url });
}
