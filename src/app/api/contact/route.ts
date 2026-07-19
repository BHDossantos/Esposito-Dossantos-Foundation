import { NextResponse } from 'next/server';
import { contactSchema, recordLead } from '@/lib/leads';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed.', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  try {
    await recordLead({
      source: 'contact',
      category: parsed.data.inquiryType || 'general',
      data: parsed.data,
      receivedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not process request.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
