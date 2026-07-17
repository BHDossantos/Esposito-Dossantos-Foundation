import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/Section';
import { SignOutButton } from '@/components/portal/PortalActions';
import { ShareBar, TrendArea } from '@/components/charts/Charts';
import { buildPageMetadata } from '@/lib/metadata';
import { PORTAL_COOKIE, verifyToken } from '@/lib/portalAuth';
import { allocation, impactSeries } from '@/content/transparency';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'sponsors');
}

export default async function SponsorDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const email = verifyToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!email) redirect('/sponsors/login');

  const t = await getTranslations('sponsors.dashboard');
  const ta = await getTranslations('transparency.allocation.items');
  const ti = await getTranslations('impact.goals.metrics');

  const last = impactSeries[impactSeries.length - 1];

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
          <SignOutButton label={t('signOut')} />
        </div>
      </header>

      <Section tone="white">
        <p className="max-w-2xl text-lg leading-relaxed text-softgray">{t('reportIntro')}</p>

        {/* Headline metrics */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: ti('students'), value: last.students },
            { label: ti('scholarships'), value: last.scholarships },
            { label: ti('programs'), value: 50 },
            { label: ti('countries'), value: 10 }
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-navy/10 bg-ivory p-6 text-center">
              <p className="font-serif text-3xl font-semibold text-champagne-dark">{m.value}+</p>
              <p className="mt-1 text-sm text-softgray">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Allocation + impact */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-navy/10 bg-ivory p-8">
            <h2 className="text-xl">{t('allocationTitle')}</h2>
            <div className="mt-6">
              <ShareBar segments={allocation.map((a) => ({ label: ta(a.key), pct: a.pct }))} />
            </div>
          </div>
          <div className="rounded-2xl border border-navy/10 bg-ivory p-8">
            <h2 className="text-xl">{t('impactTitle')}</h2>
            <div className="mt-6">
              <TrendArea
                caption={ti('students')}
                points={impactSeries.map((p) => ({ label: p.year, value: p.students }))}
              />
            </div>
          </div>
        </div>

        {/* Recognition */}
        <div className="mt-12 rounded-2xl bg-navy-800 p-8 text-ivory">
          <h2 className="font-serif text-2xl">{t('recognitionTitle')}</h2>
          <p className="mt-3 max-w-2xl text-ivory/75">{t('recognitionBody')}</p>
          <span className="btn-ghost-light mt-6 inline-block cursor-default opacity-70">
            {t('downloadBtn')}
          </span>
        </div>
      </Section>
    </>
  );
}
