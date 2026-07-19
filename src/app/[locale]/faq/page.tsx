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
  return buildPageMetadata(locale, 'faq');
}

type FaqItem = { q: string; a: string };

export default async function FaqPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('faq');
  const items = t.raw('items') as FaqItem[];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <ul className="divide-y divide-navy/10 border-t border-navy/10">
              {items.map((item, i) => (
                <li key={i}>
                  <details className="group py-5">
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium
                        text-navy transition-colors hover:text-champagne-dark [&::-webkit-details-marker]:hidden"
                    >
                      <span>{item.q}</span>
                      <span
                        aria-hidden
                        className="ml-4 flex-none text-2xl leading-none text-champagne transition-transform
                          duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl leading-relaxed text-ink/75">{item.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="ivory">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl">{t('cta.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-softgray">{t('cta.body')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary">
              {t('cta.donate')}
            </Link>
            <Link href="/contact" className="btn-secondary">
              {t('cta.contact')}
            </Link>
          </div>
        </Reveal>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
