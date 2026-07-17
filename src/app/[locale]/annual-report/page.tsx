import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ShareBar, TrendArea } from '@/components/charts/Charts';
import PrintButton from '@/components/PrintButton';
import { pillarIcons } from '@/components/Icons';
import { buildPageMetadata } from '@/lib/metadata';
import { allocation, fiscalYear, impactSeries } from '@/content/transparency';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'annualReport');
}

const pillars = ['education', 'music', 'technology', 'community', 'leadership'] as const;

export default async function AnnualReportPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('annualReport');
  const tm = await getTranslations('impact.goals.metrics');
  const ta = await getTranslations('transparency.allocation.items');
  const td = await getTranslations('transparency');
  const tp = await getTranslations('pillars');

  const last = impactSeries[impactSeries.length - 1];
  const metrics = [
    { label: tm('students'), value: `${last.students}+` },
    { label: tm('scholarships'), value: `${last.scholarships}+` },
    { label: tm('programs'), value: '50+' },
    { label: tm('partners'), value: '25+' },
    { label: tm('countries'), value: '10+' }
  ];

  return (
    <div className="bg-white">
      {/* Toolbar (hidden in print) */}
      <div className="no-print sticky top-0 z-40 border-b border-navy/10 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-medium text-navy hover:text-champagne-dark">
            ← {t('backHome')}
          </Link>
          <PrintButton label={t('print')} />
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-6 py-12">
        {/* Cover */}
        <header className="print-page flex min-h-[60vh] flex-col justify-center rounded-3xl bg-navy-900 p-12 text-ivory print-avoid-break">
          <p className="text-xs font-semibold uppercase tracking-widest2 text-champagne-light">
            {t('cover.eyebrow')} · {fiscalYear}
          </p>
          <p className="mt-6 font-serif text-2xl">
            Esposito<span className="text-champagne">–</span>Dossantos Foundation
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
            {t('cover.tagline')}
          </h1>
        </header>

        {/* Founder letter */}
        <section className="print-page mt-16 print-avoid-break">
          <h2 className="font-serif text-3xl text-navy">{t('letter.title')}</h2>
          <p className="mt-6 text-lg leading-relaxed text-softgray">{t('letter.p1')}</p>
          <p className="mt-4 text-lg leading-relaxed text-softgray">{t('letter.p2')}</p>
          <p className="mt-8 font-serif text-lg text-navy">{t('letter.signature')}</p>
        </section>

        {/* Impact at a glance */}
        <section className="mt-16 print-avoid-break">
          <h2 className="font-serif text-3xl text-navy">{t('impactTitle')}</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-5">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-navy/10 bg-ivory p-5 text-center">
                <p className="font-serif text-3xl font-semibold text-champagne-dark">{m.value}</p>
                <p className="mt-1 text-xs text-softgray">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-navy/10 bg-ivory p-8">
            <TrendArea
              caption={tm('students')}
              points={impactSeries.map((p) => ({ label: p.year, value: p.students }))}
            />
          </div>
        </section>

        {/* Allocation */}
        <section className="print-page mt-16 print-avoid-break">
          <h2 className="font-serif text-3xl text-navy">{t('allocationTitle')}</h2>
          <div className="mt-8 rounded-2xl border border-navy/10 bg-ivory p-8">
            <ShareBar segments={allocation.map((a) => ({ label: ta(a.key), pct: a.pct }))} />
          </div>
        </section>

        {/* Programs */}
        <section className="mt-16 print-avoid-break">
          <h2 className="font-serif text-3xl text-navy">{t('programsTitle')}</h2>
          <p className="mt-3 text-softgray">{t('programsIntro')}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {pillars.map((key) => {
              const Icon = pillarIcons[key];
              return (
                <div key={key} className="flex gap-4 rounded-2xl border border-navy/10 bg-ivory p-6 print-avoid-break">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-navy text-champagne">
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <h3 className="text-lg">{tp(`${key}.title`)}</h3>
                    <p className="mt-1 text-sm text-softgray">{tp(`${key}.summary`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Thanks */}
        <section className="mt-16 rounded-3xl bg-navy-900 p-12 text-center text-ivory print-avoid-break">
          <h2 className="font-serif text-3xl">{t('thanksTitle')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory/80">{t('thanksBody')}</p>
        </section>

        <p className="mt-10 text-center text-xs text-softgray">{td('disclaimer')}</p>
      </article>
    </div>
  );
}
