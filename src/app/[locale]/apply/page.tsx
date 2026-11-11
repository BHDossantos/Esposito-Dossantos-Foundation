import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import StudentApplicationForm from '@/components/forms/StudentApplicationForm';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'apply');
}

export default async function ApplyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ApplyContent />;
}

function ApplyContent() {
  const t = useTranslations('apply');
  const steps = ['s1', 's2', 's3'] as const;

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-2xl">{t('form.heading')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-softgray">{t('reassurance')}</p>
            <div className="mt-6">
              <StudentApplicationForm />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="rounded-2xl border border-champagne/30 bg-champagne/5 p-8">
              <h3 className="text-xl">{t('how.title')}</h3>
              <ol className="mt-5 space-y-5">
                {steps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-champagne font-serif text-sm font-semibold text-champagne-dark">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-navy">{t(`how.${s}.t`)}</p>
                      <p className="mt-1 text-sm text-softgray">{t(`how.${s}.d`)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
