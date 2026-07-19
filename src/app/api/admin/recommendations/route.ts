import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isValidSession } from '@/lib/adminAuth';
import { listLeads } from '@/lib/leadStore';
import { aiConfigured, getRecommendations } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  if (!aiConfigured()) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
  }

  const leads = (await listLeads(500)) ?? [];
  const recommendations = await getRecommendations(leads);
  if (recommendations === null) {
    return NextResponse.json({ ok: false, error: 'Could not generate recommendations.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, recommendations });
}
