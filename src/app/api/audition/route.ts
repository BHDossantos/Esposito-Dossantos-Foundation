import { NextResponse } from 'next/server';
import { auditionSchema, recordLead } from '@/lib/leads';
import { notifyTeam, submissionHtml } from '@/lib/email';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = auditionSchema.safeParse(body);
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
      source: 'audition',
      category: 'artist',
      data,
      receivedAt: new Date().toISOString()
    });

    // Internal copy for the team (no-op unless configured).
    await notifyTeam(
      `New audition — ${data.firstName} ${data.lastName} (${data.instrument})`,
      submissionHtml('New audition submission', {
        Name: `${data.firstName} ${data.lastName}`,
        Email: data.email,
        Instrument: data.instrument,
        Title: data.title,
        About: data.summary,
        Videos: data.videos
      })
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not process request.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
