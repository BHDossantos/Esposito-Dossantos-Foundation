import { NextResponse } from 'next/server';
import { listLeads, updateLeadFields } from '@/lib/leadStore';
import { SEQUENCES, stepHtml } from '@/lib/sequences';
import { emailConfigured, sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Processes due follow-up steps for every lead in an email sequence. Run on a
// schedule (Vercel Cron via vercel.json, or any scheduler). Authorized by
// CRON_SECRET, or by Vercel's cron header.
function authorized(request: Request): boolean {
  if (request.headers.get('x-vercel-cron')) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get('authorization');
  const url = new URL(request.url);
  return auth === `Bearer ${secret}` || url.searchParams.get('secret') === secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  if (!emailConfigured()) {
    return NextResponse.json({ ok: true, skipped: 'email not configured', sent: 0 });
  }

  const leads = await listLeads(1000);
  if (leads === null) {
    return NextResponse.json({ ok: true, skipped: 'store not configured', sent: 0 });
  }

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  let sent = 0;

  for (const lead of leads) {
    const steps = SEQUENCES[lead.source];
    const email = typeof lead.data?.email === 'string' ? (lead.data.email as string) : '';
    if (!steps || !email) continue;

    const ageDays = (now - new Date(lead.received_at).getTime()) / DAY;
    const lastSent = lead.sequence_step ?? 0;

    // Find the highest step index that is now due.
    let target = lastSent;
    for (let i = lastSent + 1; i < steps.length; i++) {
      if (ageDays >= steps[i].afterDays) target = i;
    }
    if (target <= lastSent) continue;

    // Send each newly-due step in order.
    for (let i = lastSent + 1; i <= target; i++) {
      const ok = await sendEmail(email, steps[i].subject, stepHtml(steps[i]));
      if (ok) sent++;
    }
    await updateLeadFields(lead.id, { sequence_step: target });
  }

  return NextResponse.json({ ok: true, processed: leads.length, sent });
}
