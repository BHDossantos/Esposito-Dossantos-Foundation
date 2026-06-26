import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { CalendarIcon } from '@/components/Icons';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'events');
}

const events = ['gala', 'concert', 'scholarshipNight', 'masterclass', 'workshop', 'cultural'] as const;

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EventsContent />;
}

function EventsContent() {
  const t = useTranslations('events');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <SectionHeading eyebrow={t('upcoming.eyebrow')} title={t('upcoming.title')} intro={t('upcoming.intro')} />
        <div className="mt-14 space-y-5">
          {events.map((key, i) => (
            <Reveal as="article" key={key} delay={i * 60}>
              <div className="flex flex-col gap-6 rounded-2xl border border-navy/10 bg-ivory p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex flex-none items-center gap-4 sm:w-56">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-champagne">
                    <CalendarIcon width={22} height={22} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-champagne-dark">{t(`list.${key}.date`)}</p>
                    <p className="text-xs text-softgray">{t(`list.${key}.location`)}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl">{t(`list.${key}.title`)}</h3>
                  <p className="mt-1 text-sm text-softgray">{t(`list.${key}.summary`)}</p>
                </div>
                <div className="flex flex-none gap-3">
                  <Link href="/contact" className="btn-secondary">
                    {t('rsvp')}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="ivory">
        <div className="grid gap-6 md:grid-cols-3">
          {(['sponsor', 'volunteer', 'host'] as const).map((k, i) => (
            <Reveal key={k} delay={i * 80} className="card-elevated text-center">
              <h3 className="text-xl">{t(`getInvolved.${k}.title`)}</h3>
              <p className="mt-2 text-sm text-softgray">{t(`getInvolved.${k}.body`)}</p>
              <Link href="/contact" className="mt-5 inline-block text-sm font-semibold text-champagne-dark">
                {t('getInvolved.cta')} →
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
