import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import DonateForm from '@/components/forms/DonateForm';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'donate');
}

export default async function DonatePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DonateContent />;
}

function DonateContent() {
  const t = useTranslations('donate');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-2xl">{t('give.title')}</h2>
            <p className="mt-3 text-softgray">{t('give.intro')}</p>
            <div className="mt-6">
              <DonateForm />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="rounded-2xl border border-navy/10 bg-ivory p-8">
              <h3 className="text-xl">{t('ways.title')}</h3>
              <ul className="mt-5 space-y-4">
                {(['monthly', 'corporate', 'legacy', 'bank'] as const).map((k) => (
                  <li key={k}>
                    <p className="font-medium text-navy">{t(`ways.items.${k}.title`)}</p>
                    <p className="text-sm text-softgray">{t(`ways.items.${k}.body`)}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-2xl border border-champagne/30 bg-champagne/5 p-6">
              <p className="text-sm leading-relaxed text-navy/80">{t('taxNote')}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Donor FAQ */}
      <Section tone="ivory">
        <SectionHeading eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {(['secure', 'recurring', 'receipt', 'allocation', 'cancel'] as const).map((k, i) => (
            <Reveal key={k} delay={i * 60} as="article">
              <details className="group rounded-xl border border-navy/10 bg-warmwhite p-6 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-lg font-medium text-navy marker:content-['']">
                  {t(`faq.items.${k}.q`)}
                  <span className="text-champagne-dark transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-softgray">{t(`faq.items.${k}.a`)}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
