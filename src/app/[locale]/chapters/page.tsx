import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/interactive/TiltCard';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';
import { getAllChapters } from '@/content/chapters';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'chapters');
}

export default async function ChaptersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('chapters');
  const chapters = getAllChapters(locale as Locale);

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter, i) => (
            <Reveal as="div" key={chapter.slug} delay={i * 70} className="h-full">
              <TiltCard className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-warmwhite shadow-sm">
                <Link href={`/chapters/${chapter.slug}`} className="flex h-full flex-col">
                  <div className={`relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${chapter.cover}`}>
                    <span className="text-5xl" aria-hidden="true">
                      {chapter.flag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-serif text-2xl text-navy transition-colors group-hover:text-champagne-dark">
                      {chapter.name}
                    </h2>
                    <p className="text-sm text-champagne-dark">{chapter.region}</p>
                    <p className="mt-3 flex-1 text-sm text-softgray">{chapter.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-champagne-dark">
                      {t('viewChapter')} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
