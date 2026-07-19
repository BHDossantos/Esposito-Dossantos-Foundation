import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ADMIN_COOKIE, isValidSession } from '@/lib/adminAuth';
import { LEAD_STATUSES, updateLeadStatus, type LeadStatus } from '@/lib/leadStore';

const schema = z.object({ status: z.enum(LEAD_STATUSES) });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 422 });
  }

  const ok = await updateLeadStatus(id, parsed.data.status as LeadStatus);
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Update failed.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
