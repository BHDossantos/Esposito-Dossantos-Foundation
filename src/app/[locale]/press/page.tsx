import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import CopyBlock from '@/components/press/CopyBlock';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'press');
}

const factKeys = ['founded', 'founder', 'focus', 'reach', 'languages', 'type'] as const;
const brandColors = [
  { name: 'Navy', hex: '#0B1F3A' },
  { name: 'Champagne', hex: '#C9A86A' },
  { name: 'Ivory', hex: '#FAF7F0' }
] as const;
const pressEmail = 'press@harmonia-foundation.org';

export default async function PressPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('press');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      {/* Boilerplate */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl">{t('boilerplate.title')}</h2>
          </div>
          <div className="space-y-5 lg:col-span-8">
            <Reveal>
              <CopyBlock label={t('boilerplate.shortLabel')} text={t('boilerplate.short')} />
            </Reveal>
            <Reveal delay={80}>
              <CopyBlock label={t('boilerplate.longLabel')} text={t('boilerplate.long')} />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Facts */}
      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl">{t('facts.title')}</h2>
          </div>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {factKeys.map((key, i) => (
              <Reveal as="div" key={key} delay={i * 60} className="border-b border-navy/10 pb-4">
                <dt className="text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                  {t(`facts.${key}.label`)}
                </dt>
                <dd className="mt-2 text-lg text-navy">{t(`facts.${key}.value`)}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>

      {/* Brand */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl">{t('brand.title')}</h2>
          </div>
          <div className="space-y-8 lg:col-span-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                {t('brand.nameLabel')}
              </p>
              <p className="mt-2 text-lg leading-relaxed text-ink/80">{t('brand.nameBody')}</p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                {t('brand.colorsLabel')}
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                {brandColors.map((c) => (
                  <div key={c.hex} className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 flex-none rounded-full border border-navy/15"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden
                    />
                    <span className="text-sm text-navy">
                      {c.name}
                      <span className="ml-2 text-softgray">{c.hex}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                {t('brand.toneLabel')}
              </p>
              <p className="mt-2 text-lg leading-relaxed text-ink/80">{t('brand.toneBody')}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section tone="navy">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl text-ivory">{t('contact.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ivory/80">{t('contact.body')}</p>
          <a
            href={`mailto:${pressEmail}`}
            className="mt-6 inline-block font-serif text-2xl text-champagne hover:text-champagne-light"
          >
            {pressEmail}
          </a>
          <div className="mt-8">
            <Link href="/contact" className="btn-primary">
              {t('contact.cta')}
            </Link>
          </div>
          <p className="mt-8 text-sm text-ivory/50">{t('note')}</p>
        </Reveal>
      </Section>
    </>
  );
}
