import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { CalendarIcon } from '@/components/Icons';

const events = ['gala', 'concert', 'scholarshipNight', 'masterclass'] as const;

export default function EventsPreview() {
  const t = useTranslations('home.events');
  const te = useTranslations('events.list');

  return (
    <Section tone="navy">
      <SectionHeading tone="light" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {events.map((key, i) => (
          <Reveal as="article" key={key} delay={i * 80} className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-champagne/40 hover:bg-white/[0.06]">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-champagne/15 text-champagne-light">
              <CalendarIcon width={22} height={22} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-champagne-light">
                {te(`${key}.date`)}
              </p>
              <h3 className="mt-1 text-xl text-ivory">{te(`${key}.title`)}</h3>
              <p className="mt-2 text-sm text-ivory/70">{te(`${key}.summary`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-10">
        <Link href="/events" className="btn-ghost-light">
          {t('cta')}
        </Link>
      </div>
    </Section>
  );
}
