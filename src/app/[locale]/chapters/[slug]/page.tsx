import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import FinalCTA from '@/components/sections/FinalCTA';
import { getAllChapterSlugs, getChapter } from '@/content/chapters';
import type { Locale } from '@/i18n/routing';
import { breadcrumbSchema } from '@/lib/schema';

export function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const chapter = getChapter(locale as Locale, slug);
  if (!chapter) return {};
  return {
    title: chapter.name,
    description: chapter.tagline,
    openGraph: { title: chapter.name, description: chapter.tagline }
  };
}

export default async function ChapterPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const chapter = getChapter(locale as Locale, slug);
  if (!chapter) notFound();

  const t = await getTranslations('chapters');

  const breadcrumbs = breadcrumbSchema(locale, [
    { name: 'Home', path: '' },
    { name: t('hero.eyebrow'), path: '/chapters' },
    { name: chapter.name, path: `/chapters/${slug}` }
  ]);

  return (
    <>
      <header className="relative overflow-hidden bg-navy-900 pt-36 pb-16 sm:pt-40">
        <div className={`absolute inset-0 bg-gradient-to-br ${chapter.cover} opacity-90`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,168,106,0.18),transparent_60%)]" />
        <div className="container-px relative z-10">
          <div className="max-w-3xl">
            <Link href="/chapters" className="text-sm font-medium text-champagne-light hover:text-champagne">
              ← {t('allChapters')}
            </Link>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-5xl" aria-hidden="true">
                {chapter.flag}
              </span>
              <div>
                <h1 className="font-serif text-4xl font-semibold leading-tight text-ivory sm:text-5xl">
                  {chapter.name}
                </h1>
                <p className="text-champagne-light">{chapter.region}</p>
              </div>
            </div>
            <p className="mt-6 text-lg text-ivory/80">{chapter.tagline}</p>
          </div>
        </div>
      </header>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {chapter.description.map((para, i) => (
              <p key={i} className={`leading-relaxed text-softgray ${i === 0 ? 'text-lg text-ink' : 'mt-5 text-lg'}`}>
                {para}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-navy/10 bg-ivory p-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                {t('focusLabel')}
              </h2>
              <ul className="mt-5 space-y-3">
                {chapter.focus.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-navy">
                    <span className="text-champagne-dark" aria-hidden="true">
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-navy/10 pt-6">
                <h3 className="font-serif text-xl text-navy">{t('contactTitle')}</h3>
                <p className="mt-2 text-sm text-softgray">{t('contactBody')}</p>
                <Link href="/contact" className="btn-secondary mt-5">
                  {t('contactCta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <FinalCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
