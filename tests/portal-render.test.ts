import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createFormatter, createTranslator } from 'next-intl';
import messages from '../messages/en.json';
import type { DonorSummary } from '@/lib/donations';

const state = vi.hoisted(() => ({ summary: null as DonorSummary | null }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => ({ value: 'session' }) }) }));
vi.mock('@/lib/portalAuth', () => ({ PORTAL_COOKIE: 'portal', verifyToken: () => 'donor@example.com' }));
vi.mock('@/lib/donations', () => ({ getDonorSummary: async () => state.summary }));
vi.mock('@/lib/metadata', () => ({ buildPageMetadata: vi.fn() }));
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async () => createTranslator({ locale: 'en', messages, namespace: 'portal.dashboard' }),
  getFormatter: async () => createFormatter({ locale: 'en' })
}));
vi.mock('@/components/Section', () => ({ Section: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/portal/PortalActions', () => ({ ManageButton: () => null, SignOutButton: () => null }));

async function render(summary: DonorSummary) {
  state.summary = summary;
  const { default: Page } = await import('@/app/[locale]/portal/page');
  return renderToStaticMarkup(await Page({ params: Promise.resolve({ locale: 'en' }) }));
}
const base: DonorSummary = {
  email: 'donor@example.com', found: true, customerIds: ['cus_a'], totals: [], charges: [], subscriptions: []
};
describe('donor portal rendered financial information', () => {
  it('preserves currency precision in both totals and history', async () => {
    const values = [{ currency: 'eur', amount: 9.6 }, { currency: 'bhd', amount: 1.234 }, { currency: 'jpy', amount: 1234 }];
    const html = await render({ ...base, totals: values, charges: values.map((value, i) => ({
      ...value, id: `ch_${i}`, created: 1, status: 'succeeded', receiptUrl: null, description: null
    })) });
    expect(html.match(/€9\.60/g)).toHaveLength(2);
    expect(html.match(/BHD 1\.234/g)).toHaveLength(2);
    expect(html.match(/¥1,234/g)).toHaveLength(2);
  });
  it('counts every active or trialing subscription without presenting a first-item price as its bill', async () => {
    const html = await render({ ...base, subscriptions: ['active', 'active', 'trialing', 'canceled'].map((status, i) => ({
      id: `sub_${i}`, customerId: 'cus_a', status
    })) });
    expect(html).toContain('3 active or trialing subscriptions');
    expect(html).toContain('including items, quantities, discounts and taxes');
    expect(html).not.toContain('/ month');
  });
});
