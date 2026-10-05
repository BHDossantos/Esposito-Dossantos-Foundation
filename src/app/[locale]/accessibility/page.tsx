import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'accessibility');
}

export default async function AccessibilityPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('accessibility');
  const features = t.raw('features.items') as string[];

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="mx-auto max-w-3xl space-y-12">
          <Reveal>
            <h2 className="text-2xl">{t('commitment.title')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">{t('commitment.body')}</p>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl">{t('standard.title')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">{t('standard.body')}</p>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl">{t('features.title')}</h2>
            <ul className="mt-5 space-y-3">
              {features.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-ink/80">
                  <span aria-hidden className="mt-1 flex-none text-champagne-dark">
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="ivory">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl">{t('feedback.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-softgray">{t('feedback.body')}</p>
          <div className="mt-8">
            <Link href="/contact" className="btn-primary">
              {t('feedback.cta')}
            </Link>
          </div>
          <p className="mt-8 text-sm text-softgray">{t('updated')}</p>
        </Reveal>
      </Section>
    </>
  );
}
