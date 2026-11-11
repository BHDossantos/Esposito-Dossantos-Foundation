import { NextResponse } from 'next/server';
import { studentApplicationSchema, recordLead } from '@/lib/leads';
import { notifyTeam, submissionHtml } from '@/lib/email';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = studentApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed.', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot tripped — silently succeed.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const data = { ...parsed.data };
  delete (data as { company?: string }).company;

  try {
    await recordLead({
      source: 'studentApplication',
      category: 'student',
      data,
      receivedAt: new Date().toISOString()
    });

    // Internal copy for the team (no-op unless configured).
    await notifyTeam(
      `New support application — ${data.firstName} ${data.lastName}`,
      submissionHtml('New support application', {
        Name: `${data.firstName} ${data.lastName}`,
        Email: data.email,
        Age: data.age,
        Location: data.address,
        'Heard about us': data.referral,
        'Help needed': data.need,
        Situation: data.situation,
        Motivation: data.motivation,
        'How we can help': data.help
      })
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not process request.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
