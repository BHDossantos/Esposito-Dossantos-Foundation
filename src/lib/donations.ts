// Donor giving history via Stripe, looked up by email. Read-only summaries used
// by the donor portal. Returns null when Stripe isn't configured.

export type DonorCharge = {
  id: string;
  amount: number; // major units
  currency: string;
  created: number; // unix seconds
  status: string;
  receiptUrl: string | null;
  description: string | null;
};

export type DonorSubscription = {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  status: string;
};

export type DonorSummary = {
  email: string;
  found: boolean;
  customerId: string | null;
  totalGiven: number;
  currency: string;
  charges: DonorCharge[];
  subscriptions: DonorSubscription[];
};

export function donationsConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function getDonorSummary(email: string): Promise<DonorSummary | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;

  const empty: DonorSummary = {
    email,
    found: false,
    customerId: null,
    totalGiven: 0,
    currency: 'eur',
    charges: [],
    subscriptions: []
  };

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);

    const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
    if (customers.data.length === 0) return empty;
    const customer = customers.data[0];

    const [charges, subs] = await Promise.all([
      stripe.charges.list({ customer: customer.id, limit: 24 }),
      stripe.subscriptions.list({ customer: customer.id, limit: 12, status: 'all' })
    ]);

    const paid = charges.data.filter((c) => c.paid && c.status === 'succeeded');
    const currency = paid[0]?.currency ?? 'eur';

    return {
      email,
      found: true,
      customerId: customer.id,
      currency,
      totalGiven: paid.reduce((s, c) => s + c.amount, 0) / 100,
      charges: charges.data.map((c) => ({
        id: c.id,
        amount: c.amount / 100,
        currency: c.currency,
        created: c.created,
        status: c.status,
        receiptUrl: c.receipt_url ?? null,
        description: c.description ?? null
      })),
      subscriptions: subs.data.map((s) => {
        const item = s.items.data[0]?.price;
        return {
          id: s.id,
          amount: (item?.unit_amount ?? 0) / 100,
          currency: item?.currency ?? 'eur',
          interval: item?.recurring?.interval ?? 'month',
          status: s.status
        };
      })
    };
  } catch {
    return null;
  }
}

export async function createBillingPortalUrl(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    return session.url;
  } catch {
    return null;
  }
}
