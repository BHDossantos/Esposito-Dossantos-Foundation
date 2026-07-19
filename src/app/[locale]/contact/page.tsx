import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/forms/ContactForm';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'contact');
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations('contact');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="text-2xl">{t('reach.title')}</h2>
            <p className="mt-3 text-softgray">{t('reach.intro')}</p>
            <dl className="mt-8 space-y-6">
              {(['general', 'partnership', 'media'] as const).map((k) => (
                <div key={k}>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-champagne-dark">
                    {t(`reach.channels.${k}.label`)}
                  </dt>
                  <dd className="mt-1 text-navy">
                    <a href={`mailto:${t(`reach.channels.${k}.email`)}`} className="link-underline">
                      {t(`reach.channels.${k}.email`)}
                    </a>
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-champagne-dark">
                  {t('reach.officeLabel')}
                </dt>
                <dd className="mt-1 text-navy">{t('reach.office')}</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
