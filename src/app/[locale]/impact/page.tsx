import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { ChartIcon } from '@/components/Icons';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'impact');
}

const goals = [
  { key: 'students', value: '1,000+' },
  { key: 'scholarships', value: '100+' },
  { key: 'programs', value: '50+' },
  { key: 'partners', value: '25+' },
  { key: 'countries', value: '10+' }
] as const;

const allocation = [
  { key: 'programs', percent: 78 },
  { key: 'operations', percent: 14 },
  { key: 'fundraising', percent: 8 }
] as const;

export default async function ImpactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ImpactContent />;
}

function ImpactContent() {
  const t = useTranslations('impact');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      {/* 5-year goals */}
      <Section tone="white">
        <SectionHeading eyebrow={t('goals.eyebrow')} title={t('goals.title')} intro={t('goals.intro')} />
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {goals.map((g, i) => (
            <Reveal key={g.key} delay={i * 80} className="rounded-2xl border border-navy/10 bg-ivory p-6 text-center">
              <p className="font-serif text-4xl font-semibold text-champagne-dark">{g.value}</p>
              <p className="mt-2 text-sm text-softgray">{t(`goals.metrics.${g.key}`)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Transparency / allocation */}
      <Section tone="ivory">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-champagne">
              <ChartIcon width={24} height={24} />
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl">{t('allocation.title')}</h2>
            <p className="mt-5 text-lg leading-relaxed text-softgray">{t('allocation.intro')}</p>
            <div className="mt-8 space-y-5">
              {allocation.map((a) => (
                <div key={a.key}>
                  <div className="flex items-center justify-between text-sm font-medium text-navy">
                    <span>{t(`allocation.items.${a.key}`)}</span>
                    <span>{a.percent}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy/10">
                    <div
                      className="h-full rounded-full bg-champagne"
                      style={{ width: `${a.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/transparency" className="btn-secondary mt-8">
              {t('allocation.title')} →
            </Link>
          </Reveal>

          <Reveal delay={120} className="rounded-2xl border border-navy/10 bg-warmwhite p-8">
            <h3 className="text-2xl">{t('transparency.title')}</h3>
            <ul className="mt-6 space-y-4">
              {(['reports', 'governance', 'receipts', 'audits'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <span className="mt-0.5 text-champagne-dark" aria-hidden="true">✓</span>
                  <div>
                    <p className="font-medium text-navy">{t(`transparency.items.${k}.title`)}</p>
                    <p className="text-sm text-softgray">{t(`transparency.items.${k}.body`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Stories */}
      <Section tone="navy">
        <SectionHeading tone="light" eyebrow={t('stories.eyebrow')} title={t('stories.title')} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {(['a', 'b', 'c'] as const).map((k, i) => (
            <Reveal key={k} delay={i * 90} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <p className="font-serif text-xl leading-relaxed text-ivory">“{t(`stories.items.${k}.quote`)}”</p>
              <p className="mt-5 text-sm font-semibold text-champagne-light">{t(`stories.items.${k}.name`)}</p>
              <p className="text-sm text-ivory/60">{t(`stories.items.${k}.role`)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
