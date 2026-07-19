import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { CalendarIcon } from '@/components/Icons';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';
import { getAllEvents } from '@/content/events';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'events');
}

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('events');
  const events = getAllEvents(locale as Locale);

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        <SectionHeading eyebrow={t('upcoming.eyebrow')} title={t('upcoming.title')} intro={t('upcoming.intro')} />
        <div className="mt-14 space-y-5">
          {events.map((event, i) => (
            <Reveal as="article" key={event.slug} delay={i * 60}>
              <Link
                href={`/events/${event.slug}`}
                className="group flex flex-col gap-6 rounded-2xl border border-navy/10 bg-ivory p-6 transition hover:border-champagne/40 hover:shadow-lg sm:flex-row sm:items-center sm:p-8"
              >
                <div className="flex flex-none items-center gap-4 sm:w-60">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-champagne">
                    <CalendarIcon width={22} height={22} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-champagne-dark">{event.dateLabel}</p>
                    <p className="text-xs text-softgray">{event.location}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl text-navy group-hover:text-champagne-dark">{event.title}</h3>
                    <span className="rounded-full bg-champagne/15 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-champagne-dark">
                      {t(`status.${event.status}`)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-softgray">{event.summary}</p>
                </div>
                <span className="flex-none text-sm font-semibold text-champagne-dark">
                  {t('viewEvent')} <span aria-hidden="true">→</span>
                </span>
              </Link>
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
