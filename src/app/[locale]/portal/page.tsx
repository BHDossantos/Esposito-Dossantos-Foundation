import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/Section';
import { ManageButton, SignOutButton } from '@/components/portal/PortalActions';
import { buildPageMetadata } from '@/lib/metadata';
import { PORTAL_COOKIE, verifyToken } from '@/lib/portalAuth';
import { getDonorSummary } from '@/lib/donations';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'portal');
}

export default async function PortalPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const email = verifyToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!email) redirect('/portal/login');

  const t = await getTranslations('portal.dashboard');
  const format = await getFormatter();
  const summary = await getDonorSummary(email);
  const money = (n: number, cur = 'eur') =>
    format.number(n, { style: 'currency', currency: cur.toUpperCase(), maximumFractionDigits: 0 });

  return (
    <>
      <header className="bg-navy-900 pt-32 pb-14">
        <div className="container-px flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-champagne-light">
              {t('welcome')}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-ivory">{t('title')}</h1>
            <p className="mt-2 text-ivory/70">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            <SignOutButtonWrapper label={t('signOut')} />
          </div>
        </div>
      </header>

      <Section tone="white">
        {summary === null ? (
          <div className="rounded-2xl border border-champagne/30 bg-champagne/5 p-8">
            <h2 className="font-serif text-2xl text-navy">{t('setupTitle')}</h2>
            <p className="mt-3 max-w-2xl text-softgray">{t('setupBody')}</p>
          </div>
        ) : (
          <>
            {/* Total + subscriptions */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-navy/10 bg-ivory p-6">
                <p className="text-sm text-softgray">{t('totalLabel')}</p>
                <p className="mt-1 font-serif text-3xl font-semibold text-navy">
                  {money(summary.totalGiven, summary.currency)}
                </p>
              </div>
              {summary.subscriptions
                .filter((s) => s.status === 'active' || s.status === 'trialing')
                .slice(0, 2)
                .map((s) => (
                  <div key={s.id} className="rounded-2xl border border-navy/10 bg-ivory p-6">
                    <p className="text-sm text-softgray">{t('subsTitle')}</p>
                    <p className="mt-1 font-serif text-2xl font-semibold text-navy">
                      {money(s.amount, s.currency)}
                      <span className="text-base font-normal text-softgray"> / {s.interval}</span>
                    </p>
                  </div>
                ))}
            </div>

            <div className="mt-6">
              <ManageButtonWrapper label={t('manageBtn')} show={Boolean(summary.customerId)} />
            </div>

            {/* History */}
            <h2 className="mt-12 text-2xl">{t('historyTitle')}</h2>
            {summary.charges.length === 0 ? (
              <p className="mt-4 text-softgray">{t('empty')}</p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-navy/10 bg-warmwhite">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-navy/10 text-xs uppercase tracking-wide text-softgray">
                    <tr>
                      <th className="px-5 py-3 font-semibold">{t('dateCol')}</th>
                      <th className="px-5 py-3 font-semibold">{t('amountCol')}</th>
                      <th className="px-5 py-3 font-semibold">{t('statusCol')}</th>
                      <th className="px-5 py-3 font-semibold">{t('receiptCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.charges.map((c) => (
                      <tr key={c.id} className="border-b border-navy/5 last:border-0">
                        <td className="px-5 py-3 text-softgray">
                          {format.dateTime(new Date(c.created * 1000), { dateStyle: 'medium' })}
                        </td>
                        <td className="px-5 py-3 font-medium text-navy">{money(c.amount, c.currency)}</td>
                        <td className="px-5 py-3 text-navy">{c.status}</td>
                        <td className="px-5 py-3">
                          {c.receiptUrl ? (
                            <a
                              href={c.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-champagne-dark hover:underline"
                            >
                              {t('receipt')}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}

// Small wrappers keep the client components isolated.
function SignOutButtonWrapper({ label }: { label: string }) {
  return <SignOutButton label={label} />;
}
function ManageButtonWrapper({ label, show }: { label: string; show: boolean }) {
  if (!show) return null;
  return <ManageButton label={label} />;
}
