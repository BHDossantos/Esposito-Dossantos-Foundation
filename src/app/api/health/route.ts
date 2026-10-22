import { NextResponse } from 'next/server';
import { storeConfigured } from '@/lib/leadStore';
import { emailConfigured } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Lightweight config health check. Reports ONLY booleans (and the Supabase
// host, which is not a secret) so we can verify which integrations the running
// deployment actually sees — without ever exposing a key value.
export async function GET() {
  let supabaseHost: string | null = null;
  const url = process.env.SUPABASE_URL;
  if (url) {
    try {
      supabaseHost = new URL(url).host;
    } catch {
      supabaseHost = 'invalid-url';
    }
  }

  return NextResponse.json({
    supabase: storeConfigured(),
    supabaseHost,
    email: emailConfigured(),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    notifyEmailSet: Boolean(process.env.LEADS_NOTIFY_EMAIL),
    time: new Date().toISOString()
  });
}
