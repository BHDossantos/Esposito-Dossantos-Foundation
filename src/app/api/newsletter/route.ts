import { NextResponse } from 'next/server';
import { newsletterSchema, recordLead } from '@/lib/leads';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed.', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    await recordLead({
      source: 'newsletter',
      category: parsed.data.interest || 'general',
      data: parsed.data,
      receivedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not process request.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
