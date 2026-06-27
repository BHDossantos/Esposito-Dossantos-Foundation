import { NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSchema = z.object({
  amount: z.coerce.number().int().min(1).max(1_000_000),
  frequency: z.enum(['oneTime', 'monthly', 'annual']),
  currency: z.string().trim().length(3).toLowerCase().default('eur'),
  locale: z.string().trim().max(5).optional()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed.' }, { status: 422 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  // Graceful degradation: if Stripe isn't configured yet, tell the client so it
  // can show a friendly message instead of failing hard.
  if (!secret) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
  }

  const { amount, frequency, currency, locale } = parsed.data;

  const origin =
    request.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin;
  const prefix = locale && locale !== 'en' ? `/${locale}` : '';

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);

    const isRecurring = frequency !== 'oneTime';
    const productName =
      frequency === 'monthly'
        ? 'Monthly donation'
        : frequency === 'annual'
          ? 'Annual donation'
          : 'Donation';

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount * 100,
            product_data: { name: `Esposito–Dossantos Foundation — ${productName}` },
            ...(isRecurring
              ? { recurring: { interval: frequency === 'monthly' ? 'month' : 'year' } }
              : {})
          }
        }
      ],
      submit_type: isRecurring ? undefined : 'donate',
      success_url: `${origin}${prefix}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${prefix}/donate`
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not start checkout.' }, { status: 500 });
  }
}
