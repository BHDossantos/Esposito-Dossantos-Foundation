import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import SponsorshipTiers from '@/components/sections/SponsorshipTiers';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'partners');
}

const partnerTypes = ['corporate', 'schools', 'universities', 'cultural', 'government'] as const;

export default async function PartnersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PartnersContent />;
}

function PartnersContent() {
  const t = useTranslations('partners');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')}>
        <Link href="/contact" className="btn-primary">
          {t('hero.cta')}
        </Link>
      </PageHero>

      <Section tone="white">
        <SectionHeading eyebrow={t('types.eyebrow')} title={t('types.title')} intro={t('types.intro')} />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partnerTypes.map((key, i) => (
            <Reveal as="article" key={key} delay={i * 70} className="card-elevated">
              <h3 className="text-2xl">{t(`types.items.${key}.title`)}</h3>
              <p className="mt-3 text-softgray">{t(`types.items.${key}.body`)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <SponsorshipTiers />
      <FinalCTA />
    </>
  );
}
