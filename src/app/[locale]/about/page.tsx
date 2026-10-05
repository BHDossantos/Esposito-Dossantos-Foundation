import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'about');
}

const board = ['founder', 'cofounder', 'director', 'treasurer'] as const;
const governance = ['structure', 'legal', 'accountability', 'ethics'] as const;

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('about');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      {/* Story */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,168,106,0.25),transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-serif text-2xl text-ivory">Bruno Dossantos</p>
                <p className="text-sm text-champagne-light">{t('story.founderRole')}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow mb-4">{t('story.eyebrow')}</p>
            <h2 className="text-3xl sm:text-4xl">{t('story.title')}</h2>
            <p className="mt-6 text-lg leading-relaxed text-softgray">{t('story.body1')}</p>
            <p className="mt-4 text-lg leading-relaxed text-softgray">{t('story.body2')}</p>
            <p className="mt-4 text-lg leading-relaxed text-softgray">{t('story.body3')}</p>
          </Reveal>
        </div>
      </Section>

      {/* Board */}
      <Section tone="ivory">
        <SectionHeading eyebrow={t('board.eyebrow')} title={t('board.title')} intro={t('board.intro')} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {board.map((key, i) => (
            <Reveal key={key} delay={i * 70} className="rounded-2xl border border-navy/10 bg-warmwhite p-6 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-navy-600 to-navy-900" />
              <h3 className="mt-5 text-lg">{t(`board.members.${key}.name`)}</h3>
              <p className="text-sm text-champagne-dark">{t(`board.members.${key}.role`)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Governance */}
      <Section tone="navy">
        <SectionHeading tone="light" eyebrow={t('governance.eyebrow')} title={t('governance.title')} intro={t('governance.intro')} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {governance.map((key, i) => (
            <Reveal key={key} delay={i * 70} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-xl text-ivory">{t(`governance.items.${key}.title`)}</h3>
              <p className="mt-3 text-ivory/70">{t(`governance.items.${key}.body`)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
