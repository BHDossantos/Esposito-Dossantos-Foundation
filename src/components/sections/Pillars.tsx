import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { pillarIcons } from '@/components/Icons';

const pillars = [
  { key: 'education', href: '/programs#education' },
  { key: 'music', href: '/programs#music' },
  { key: 'technology', href: '/programs#technology' },
  { key: 'community', href: '/programs#community' },
  { key: 'leadership', href: '/programs#leadership' }
] as const;

export default function Pillars() {
  const t = useTranslations('home.pillars');
  const tp = useTranslations('pillars');

  return (
    <Section tone="ivory" id="pillars">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar, i) => {
          const Icon = pillarIcons[pillar.key];
          return (
            <Reveal as="article" key={pillar.key} delay={i * 80} className="card-elevated group flex flex-col">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-champagne transition-colors group-hover:bg-champagne group-hover:text-navy">
                <Icon />
              </span>
              <h3 className="mt-6 text-2xl">{tp(`${pillar.key}.title`)}</h3>
              <p className="mt-3 flex-1 text-softgray">{tp(`${pillar.key}.summary`)}</p>
              <Link href={pillar.href} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-champagne-dark">
                {t('learnMore')}
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          );
        })}
        <Reveal as="article" delay={pillars.length * 80} className="flex flex-col justify-center rounded-2xl bg-navy-800 p-8 text-ivory">
          <h3 className="text-2xl text-ivory">{t('ctaCardTitle')}</h3>
          <p className="mt-3 text-ivory/75">{t('ctaCardCopy')}</p>
          <Link href="/donate" className="btn-primary mt-6 self-start">
            {t('ctaCardButton')}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
