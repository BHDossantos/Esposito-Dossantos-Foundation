import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import SponsorTiers from '@/components/forms/SponsorTiers';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'sponsor');
}

export default async function SponsorPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SponsorContent />;
}

function SponsorContent() {
  const t = useTranslations('sponsor');
  const steps = ['s1', 's2', 's3'] as const;

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-2xl">{t('lead.title')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-softgray">{t('lead.body')}</p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <SponsorTiers />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-2xl">
          <p className="rounded-2xl border border-champagne/30 bg-champagne/5 p-6 text-center text-sm leading-relaxed text-navy/80">
            {t('trust')}
          </p>
        </Reveal>
      </Section>

      {/* How it works */}
      <Section tone="ivory">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl">{t('how.title')}</h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="div" key={s} delay={i * 90}>
              <div className="h-full rounded-2xl border border-navy/10 bg-white p-7 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-champagne font-serif text-sm font-semibold text-champagne-dark">
                  {i + 1}
                </span>
                <p className="mt-4 font-medium text-navy">{t(`how.${s}.t`)}</p>
                <p className="mt-2 text-sm text-softgray">{t(`how.${s}.d`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* One-time gift */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-2xl rounded-2xl border border-navy/10 bg-ivory p-8 text-center">
          <h2 className="text-xl">{t('oneTime.title')}</h2>
          <p className="mt-3 text-softgray">{t('oneTime.body')}</p>
          <Link href="/donate" className="btn-secondary mt-6 inline-block">
            {t('oneTime.cta')}
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
