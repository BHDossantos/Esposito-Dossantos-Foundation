import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/interactive/TiltCard';

export const featuredProgramKeys = [
  'musicScholarship',
  'youthLeadership',
  'technologyAccess',
  'globalMentorship',
  'communityConcert',
  'artistDevelopment'
] as const;

export default function FeaturedPrograms() {
  const t = useTranslations('home.programs');
  const tp = useTranslations('programs.featured');

  return (
    <Section tone="white">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProgramKeys.map((key, i) => (
          <Reveal as="div" key={key} delay={i * 70} className="h-full">
            <TiltCard className="card-elevated flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-champagne/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-champagne-dark">
                  {tp(`${key}.tag`)}
                </span>
                <span className="text-xs font-medium text-softgray">{tp(`${key}.status`)}</span>
              </div>
              <h3 className="mt-5 text-2xl">{tp(`${key}.title`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-softgray">
                {tp(`${key}.description`)}
              </p>
              <dl className="mt-5 space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="font-semibold text-navy">{t('servesLabel')}:</dt>
                  <dd className="text-softgray">{tp(`${key}.serves`)}</dd>
                </div>
              </dl>
              <Link href="/programs" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-champagne-dark">
                {t('details')} <span aria-hidden="true">→</span>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
