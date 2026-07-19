import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import PortalLoginForm from '@/components/portal/PortalLoginForm';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'sponsors');
}

export default async function SponsorLoginPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sponsors.login');

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <Section tone="white">
        <div className="mx-auto max-w-md">
          <PortalLoginForm next="/sponsors" />
        </div>
      </Section>
    </>
  );
}
