import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { HorizontalBars, ShareBar, TrendArea } from '@/components/charts/Charts';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';
import {
  allocation,
  fiscalYear,
  impactSeries,
  revenue,
  spendingByPillar,
  totalRevenue
} from '@/content/transparency';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'transparency');
}

export default async function TransparencyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('transparency');
  const format = await getFormatter();
  const money = (n: number) =>
    format.number(n, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  const governanceKeys = ['reports', 'board', 'audits', 'receipts'] as const;

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      {/* Disclaimer */}
      <div className="border-b border-navy/10 bg-champagne/5">
        <div className="container-px py-4">
          <p className="text-center text-xs leading-relaxed text-navy/70">{t('disclaimer')}</p>
        </div>
      </div>

      {/* Allocation */}
      <Section tone="white">
        <SectionHeading eyebrow={`FY ${fiscalYear}`} title={t('allocation.title')} intro={t('allocation.intro')} />
        <Reveal className="mt-12 rounded-2xl border border-navy/10 bg-ivory p-8">
          <ShareBar
            segments={allocation.map((a) => ({ label: t(`allocation.items.${a.key}`), pct: a.pct }))}
          />
        </Reveal>
      </Section>

      {/* Revenue + Spending */}
      <Section tone="ivory">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl">{t('revenue.title')}</h2>
            <p className="mt-2 text-softgray">{t('revenue.intro')}</p>
            <div className="mt-8">
              <HorizontalBars
                items={revenue.map((r) => ({
                  label: t(`revenue.items.${r.key}`),
                  value: r.amount,
                  display: money(r.amount)
                }))}
              />
            </div>
            <p className="mt-6 border-t border-navy/10 pt-4 text-sm">
              <span className="text-softgray">{t('revenue.totalLabel')}: </span>
              <span className="font-serif text-lg font-semibold text-navy">{money(totalRevenue)}</span>
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="text-2xl">{t('spending.title')}</h2>
            <p className="mt-2 text-softgray">{t('spending.intro')}</p>
            <div className="mt-8">
              <HorizontalBars
                hue="#15355F"
                items={spendingByPillar.map((s) => ({
                  label: t(`spending.items.${s.key}`),
                  value: s.amount,
                  display: money(s.amount)
                }))}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Impact trajectory */}
      <Section tone="white">
        <SectionHeading eyebrow={t('hero.eyebrow')} title={t('impact.title')} intro={t('impact.intro')} />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <Reveal className="rounded-2xl border border-navy/10 bg-ivory p-8">
            <TrendArea
              caption={t('impact.students')}
              points={impactSeries.map((p) => ({ label: p.year, value: p.students }))}
            />
          </Reveal>
          <Reveal delay={120} className="rounded-2xl border border-navy/10 bg-ivory p-8">
            <TrendArea
              hue="#15355F"
              caption={t('impact.scholarships')}
              points={impactSeries.map((p) => ({ label: p.year, value: p.scholarships }))}
            />
          </Reveal>
        </div>
      </Section>

      {/* Governance */}
      <Section tone="navy">
        <SectionHeading tone="light" title={t('governance.title')} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {governanceKeys.map((k, i) => (
            <Reveal key={k} delay={i * 70} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg text-ivory">{t(`governance.items.${k}.title`)}</h3>
              <p className="mt-2 text-sm text-ivory/70">{t(`governance.items.${k}.body`)}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-white/[0.04] p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl text-ivory">{t('report.title')}</h3>
            <p className="mt-1 text-ivory/70">{t('report.body')}</p>
          </div>
          <span className="btn-ghost-light cursor-default opacity-70">{t('report.button')}</span>
        </Reveal>
      </Section>

      <FinalCTA />
    </>
  );
}
