import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import Pillars from '@/components/sections/Pillars';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';
import { HeartIcon, ShieldIcon, GlobeIcon } from '@/components/Icons';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'mission');
}

const valueKeys = [
  'integrity',
  'compassion',
  'excellence',
  'innovation',
  'education',
  'culture',
  'collaboration',
  'service',
  'inclusion',
  'sustainability'
] as const;

export default async function MissionPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MissionContent />;
}

function MissionContent() {
  const t = useTranslations('mission');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      {/* Mission + Vision */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-navy/10 bg-ivory p-8 lg:p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-champagne">
              <HeartIcon width={24} height={24} />
            </span>
            <h2 className="mt-6 text-2xl">{t('statement.missionLabel')}</h2>
            <p className="mt-4 font-serif text-xl leading-relaxed text-navy/90">
              {t('statement.mission')}
            </p>
          </Reveal>
          <Reveal delay={120} className="rounded-2xl border border-navy/10 bg-ivory p-8 lg:p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-champagne">
              <GlobeIcon width={24} height={24} />
            </span>
            <h2 className="mt-6 text-2xl">{t('statement.visionLabel')}</h2>
            <p className="mt-4 font-serif text-xl leading-relaxed text-navy/90">
              {t('statement.vision')}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Belief / long-term purpose banner */}
      <Section tone="navy">
        <Reveal className="mx-auto max-w-4xl text-center">
          <ShieldIcon width={36} height={36} className="mx-auto text-champagne" />
          <p className="mt-8 font-serif text-2xl leading-relaxed text-ivory sm:text-3xl">
            “{t('belief')}”
          </p>
          <p className="mt-8 text-lg leading-relaxed text-ivory/75">{t('purpose')}</p>
        </Reveal>
      </Section>

      {/* Core values */}
      <Section tone="ivory">
        <SectionHeading eyebrow={t('values.eyebrow')} title={t('values.title')} intro={t('values.intro')} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {valueKeys.map((key, i) => (
            <Reveal
              key={key}
              delay={i * 50}
              className="flex gap-4 rounded-xl border border-navy/5 bg-warmwhite p-5"
            >
              <span className="font-serif text-2xl font-semibold text-champagne">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-lg">{t(`values.items.${key}.title`)}</h3>
                <p className="mt-1 text-sm text-softgray">{t(`values.items.${key}.body`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Pillars />
      <FinalCTA />
    </>
  );
}
