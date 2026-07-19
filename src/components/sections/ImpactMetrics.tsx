import { useTranslations } from 'next-intl';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';

const metrics = [
  { key: 'students', value: '1,000+' },
  { key: 'scholarships', value: '100+' },
  { key: 'programs', value: '50+' },
  { key: 'partners', value: '25+' },
  { key: 'countries', value: '10+' }
] as const;

export default function ImpactMetrics() {
  const t = useTranslations('home.impact');

  return (
    <Section tone="navy">
      <SectionHeading
        tone="light"
        align="center"
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
      />
      <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((metric, i) => (
          <Reveal key={metric.key} delay={i * 90} className="text-center">
            <p className="font-serif text-4xl font-semibold text-champagne sm:text-5xl">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-snug text-ivory/70">
              {t(`metrics.${metric.key}`)}
            </p>
          </Reveal>
        ))}
      </div>
      <p className="mt-12 text-center text-xs uppercase tracking-widest2 text-ivory/40">
        {t('disclaimer')}
      </p>
    </Section>
  );
}
