import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import RsvpForm from '@/components/forms/RsvpForm';
import { CalendarIcon } from '@/components/Icons';
import { getAllEventSlugs, getEvent } from '@/content/events';
import type { Locale } from '@/i18n/routing';
import { breadcrumbSchema } from '@/lib/schema';

export function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = getEvent(locale as Locale, slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    openGraph: { type: 'website', title: event.title, description: event.summary }
  };
}

export default async function EventPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const event = getEvent(locale as Locale, slug);
  if (!event) notFound();

  const t = await getTranslations('events');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    ...(event.isoDate ? { startDate: event.isoDate } : {}),
    location: { '@type': 'Place', name: event.location },
    organizer: { '@type': 'NGO', name: 'Harmonia Foundation' }
  };

  const breadcrumbs = breadcrumbSchema(locale, [
    { name: 'Home', path: '' },
    { name: t('hero.eyebrow'), path: '/events' },
    { name: event.title, path: `/events/${slug}` }
  ]);

  return (
    <>
      <header className="relative overflow-hidden bg-navy-900 pt-36 pb-16 sm:pt-40">
        <div className={`absolute inset-0 bg-gradient-to-br ${event.cover} opacity-90`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,168,106,0.18),transparent_60%)]" />
        <div className="container-px relative z-10">
          <div className="max-w-3xl">
            <Link href="/events" className="text-sm font-medium text-champagne-light hover:text-champagne">
              ← {t('allEvents')}
            </Link>
            <span className="mt-6 inline-block rounded-full bg-champagne px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-900">
              {t(`status.${event.status}`)}
            </span>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] text-ivory sm:text-5xl">
              {event.title}
            </h1>
            <p className="mt-5 text-lg text-ivory/80">{event.summary}</p>
          </div>
        </div>
      </header>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl">{t('detail.aboutTitle')}</h2>
            {event.description.map((para, i) => (
              <p key={i} className="mt-4 text-lg leading-relaxed text-softgray">
                {para}
              </p>
            ))}

            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-champagne-dark">
                  <CalendarIcon width={20} height={20} />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-champagne-dark">
                    {t('detail.whenLabel')}
                  </dt>
                  <dd className="mt-1 text-navy">{event.dateLabel}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-champagne-dark" aria-hidden="true">
                  ◎
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-champagne-dark">
                    {t('detail.whereLabel')}
                  </dt>
                  <dd className="mt-1 text-navy">{event.location}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-2xl">{t('detail.rsvpTitle')}</h2>
            <p className="mt-2 text-softgray">{t('detail.rsvpIntro')}</p>
            <div className="mt-5">
              <RsvpForm eventSlug={event.slug} eventTitle={event.title} />
            </div>
          </div>
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
