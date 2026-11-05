import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ customers: vi.fn(), charges: vi.fn(), subscriptions: vi.fn(), checkout: vi.fn(), portal: vi.fn() }));
vi.mock('stripe', () => ({ default: class {
  customers = { list: mocks.customers };
  charges = { list: mocks.charges };
  subscriptions = { list: mocks.subscriptions };
  checkout = { sessions: { create: mocks.checkout } };
  billingPortal = { sessions: { create: mocks.portal } };
} }));
const cookie = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: async () => cookie }));
// Stripe list responses are both a first-page promise and an async iterator.
// Preserve both interfaces so the original implementation can be reproduced.
function items<T>(values: T[], laterError?: Error) {
  return Object.assign(Promise.resolve({ data: values.slice(0, 24), has_more: values.length > 24 }), {
    async *[Symbol.asyncIterator]() {
      for (const value of values) yield value;
      if (laterError) throw laterError;
    }
  });
}
function charge(id: string, overrides = {}) {
  return { id, amount: 1000, amount_captured: 1000, amount_refunded: 0, currency: 'eur', paid: true,
    captured: true, status: 'succeeded', refunded: false, disputed: false, created: 1, ...overrides };
}
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks();
  vi.stubEnv('STRIPE_SECRET_KEY', 'test-placeholder'); vi.stubEnv('PORTAL_SECRET', 'test-secret');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://foundation.example');
  mocks.customers.mockImplementation(() => items([{ id: 'cus_a' }]));
  mocks.charges.mockImplementation(() => items([]));
  mocks.subscriptions.mockImplementation(() => items([]));
  mocks.checkout.mockResolvedValue({ url: 'https://checkout.stripe.example/session' });
  mocks.portal.mockResolvedValue({ url: 'https://billing.stripe.example/session' });
});
afterEach(() => vi.unstubAllEnvs());

describe('complete donor summaries', () => {
  it('consumes all customers and history beyond the old 24-charge page; separates currencies and refunds', async () => {
    mocks.customers.mockImplementation(() => items([{ id: 'cus_a' }, { id: 'cus_b' }]));
    mocks.charges.mockImplementation(({ customer }) => items(customer === 'cus_a' ?
      Array.from({ length: 25 }, (_, i) => charge(`ch_${i}`)) : [
        charge('partial', { amount_refunded: 400 }), charge('full', { amount_refunded: 1000, refunded: true }),
        charge('usd', { currency: 'usd', amount_captured: 2000 }),
        charge('uncaptured', { captured: false, amount_captured: 0 }),
        charge('failed', { paid: false, status: 'failed', amount_captured: 0 })
      ]));
    const { getDonorSummary } = await import('@/lib/donations');
    const result = await getDonorSummary('Donor@Example.com');
    expect(result?.customerIds).toEqual(['cus_a', 'cus_b']);
    expect(result?.totals).toEqual([{ currency: 'eur', amount: 256 }, { currency: 'usd', amount: 20 }]);
    expect(result?.charges).toHaveLength(30);
    expect(result?.charges.find(c => c.id === 'full')).toMatchObject({ status: 'refunded', amount: 0 });
    expect(mocks.customers).toHaveBeenCalledWith({ email: 'donor@example.com', limit: 100 });
  });
  it('uses captured rather than authorized amount and handles zero/three decimal currencies', async () => {
    mocks.charges.mockImplementation(() => items([
      charge('partial_capture', { amount_captured: 400 }),
      charge('jpy', { currency: 'jpy' }), charge('bhd', { currency: 'bhd' }), charge('isk', { currency: 'isk' })
    ]));
    const { getDonorSummary } = await import('@/lib/donations');
    expect((await getDonorSummary('a@b.com'))?.totals).toEqual([
      { currency: 'bhd', amount: 1 }, { currency: 'eur', amount: 4 },
      { currency: 'isk', amount: 10 }, { currency: 'jpy', amount: 1000 }
    ]);
  });
  it('returns unavailable, never partial totals, when later provider iteration fails', async () => {
    mocks.charges.mockImplementation(() => items([charge('first')], new Error('later page failed')));
    const { getDonorSummary } = await import('@/lib/donations');
    expect(await getDonorSummary('a@b.com')).toBeNull();
  });
  it('fails closed when the interactive history limit is exceeded', async () => {
    mocks.charges.mockImplementation(() => items(Array.from({ length: 10000 }, (_, i) => charge(`ch_${i}`))));
    const { getDonorSummary } = await import('@/lib/donations');
    expect(await getDonorSummary('a@b.com')).toBeNull();
  });
});

describe('checkout and billing account ownership', () => {
  it('returns unavailable on a provider outage, not a missing billing account', async () => {
    mocks.customers.mockImplementation(async function* () { throw new Error('outage'); });
    const { createSessionToken } = await import('@/lib/portalAuth');
    cookie.get.mockReturnValue({ value: createSessionToken('a@example.com') });
    const { POST } = await import('@/app/api/portal/manage/route');
    expect((await POST(new Request('https://foundation.example/api/portal/manage', { method: 'POST' }))).status).toBe(503);
    expect(mocks.portal).not.toHaveBeenCalled();
  });
  it('uses canonical redirects, creates a customer for one-time gifts, and rejects unsupported currency', async () => {
    const { POST } = await import('@/app/api/checkout/route');
    const req = (currency: string) => new Request('https://evil.example/api/checkout', {
      method: 'POST', headers: { origin: 'https://evil.example' },
      body: JSON.stringify({ amount: 10, frequency: 'oneTime', currency, locale: 'it' })
    });
    expect((await POST(req('eur'))).status).toBe(200);
    expect(mocks.checkout.mock.calls[0][0]).toMatchObject({ customer_creation: 'always',
      success_url: 'https://foundation.example/it/donate/thank-you?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://foundation.example/it/donate' });
    expect((await POST(req('jpy'))).status).toBe(422);
    expect(mocks.checkout).toHaveBeenCalledOnce();
  });
  it('refuses another donor customer and requires an explicit choice for multiple owned accounts', async () => {
    mocks.customers.mockImplementation(() => items([{ id: 'cus_a' }, { id: 'cus_b' }]));
    const { createSessionToken } = await import('@/lib/portalAuth');
    cookie.get.mockReturnValue({ value: createSessionToken('a@example.com') });
    const { POST } = await import('@/app/api/portal/manage/route');
    const req = (body: unknown) => new Request('https://evil.example/api/portal/manage', {
      method: 'POST', headers: { origin: 'https://evil.example' }, body: JSON.stringify(body)
    });
    expect((await POST(req({}))).status).toBe(400);
    expect((await POST(req({ customerId: 'cus_other' }))).status).toBe(400);
    expect(mocks.portal).not.toHaveBeenCalled();
    expect((await POST(req({ customerId: 'cus_b' }))).status).toBe(200);
    expect(mocks.portal).toHaveBeenCalledWith({ customer: 'cus_b', return_url: 'https://foundation.example/portal' });
  });
});
