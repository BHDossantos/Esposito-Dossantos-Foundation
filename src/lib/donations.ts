// Read-only Stripe history for the verified mailbox. Totals cover captured
// gifts less refunds, grouped by currency; they are not tax receipts.
export type DonorCharge = {
  id: string; amount: number; currency: string; created: number;
  status: string; receiptUrl: string | null; description: string | null;
};
export type DonorSubscription = {
  id: string; customerId: string; status: string;
};
export type DonorSummary = {
  email: string; found: boolean; customerIds: string[];
  totals: { currency: string; amount: number }[];
  charges: DonorCharge[]; subscriptions: DonorSubscription[];
};
export function donationsConfigured(): boolean { return Boolean(process.env.STRIPE_SECRET_KEY); }

// Stripe uses two decimal minor units for ISK and UGX even though their ISO
// display precision is zero. Other supported currencies use ISO precision.
export function majorUnits(amount: number, currency: string): number {
  const digits = ['isk', 'ugx'].includes(currency.toLowerCase()) ? 2 :
    new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits;
  return amount / 10 ** (digits ?? 2);
}

export async function getDonorSummary(email: string): Promise<DonorSummary | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  const result: DonorSummary = { email, found: false, customerIds: [], totals: [], charges: [], subscriptions: [] };
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);
    const totals = new Map<string, number>();
    const seen = new Set<string>();
    let resources = 0;
    const count = () => {
      // Fail closed, never return a silently truncated lifetime total.
      if (++resources > 10000) throw new Error('History exceeds interactive budget');
    };
    for await (const customer of stripe.customers.list({ email: email.toLowerCase(), limit: 100 })) {
      count();
      result.customerIds.push(customer.id);
      for await (const c of stripe.charges.list({ customer: customer.id, limit: 100 })) {
        count();
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        const captured = c.paid && c.status === 'succeeded' && c.captured;
        const net = captured ? Math.max(0, c.amount_captured - c.amount_refunded) : 0;
        if (captured) totals.set(c.currency, (totals.get(c.currency) ?? 0) + net);
        result.charges.push({
          id: c.id, amount: majorUnits(net, c.currency), currency: c.currency,
          created: c.created,
          status: c.refunded ? 'refunded' : c.amount_refunded > 0 ? 'partially_refunded' :
            c.disputed ? 'disputed' : !c.captured && c.paid ? 'uncaptured' : c.status,
          receiptUrl: c.receipt_url ?? null, description: c.description ?? null
        });
      }
      for await (const s of stripe.subscriptions.list({ customer: customer.id, limit: 100, status: 'all' })) {
        count();
        result.subscriptions.push({
          id: s.id, customerId: customer.id, status: s.status
        });
      }
    }
    result.found = result.customerIds.length > 0;
    result.totals = [...totals].sort(([a], [b]) => a.localeCompare(b))
      .map(([currency, amount]) => ({ currency, amount: majorUnits(amount, currency) }));
    result.charges.sort((a, b) => b.created - a.created);
    return result;
  } catch {
    // Provider failures are not an empty or partially correct giving history.
    return null;
  }
}

export async function createBillingPortalUrl(customerId: string, returnUrl: string): Promise<string | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
    return session.url;
  } catch { return null; }
}
