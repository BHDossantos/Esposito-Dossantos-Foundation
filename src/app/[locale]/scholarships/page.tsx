import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import ApplicationForm from '@/components/forms/ApplicationForm';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'scholarships');
}

export default async function ScholarshipsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ScholarshipsContent />;
}

function ScholarshipsContent() {
  const t = useTranslations('scholarships');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />
      <Section tone="white">
        <Reveal className="mx-auto max-w-3xl">
          <ApplicationForm kind="scholarship" />
        </Reveal>
      </Section>
    </>
  );
}
