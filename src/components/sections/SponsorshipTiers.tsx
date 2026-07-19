import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';

const tiers = [
  { key: 'bronze', amount: '€5,000+', featured: false },
  { key: 'silver', amount: '€10,000+', featured: false },
  { key: 'gold', amount: '€25,000+', featured: true },
  { key: 'platinum', amount: '€50,000+', featured: false },
  { key: 'legacy', amount: '€100,000+', featured: false }
] as const;

const benefitKeys = ['website', 'event', 'report', 'social', 'certificate', 'briefing'] as const;

export default function SponsorshipTiers() {
  const t = useTranslations('partners.sponsorship');

  return (
    <Section tone="white" id="corporate">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {tiers.map((tier, i) => (
          <Reveal
            as="article"
            key={tier.key}
            delay={i * 70}
            className={`flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
              tier.featured
                ? 'border-champagne bg-navy-800 text-ivory shadow-xl'
                : 'border-navy/10 bg-warmwhite'
            }`}
          >
            {tier.featured ? (
              <span className="mb-3 inline-block self-start rounded-full bg-champagne px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-navy">
                {t('popular')}
              </span>
            ) : null}
            <h3 className={`text-xl ${tier.featured ? 'text-ivory' : ''}`}>{t(`tiers.${tier.key}`)}</h3>
            <p className={`mt-2 font-serif text-2xl font-semibold ${tier.featured ? 'text-champagne-light' : 'text-champagne-dark'}`}>
              {tier.amount}
            </p>
            <p className={`mt-3 text-sm ${tier.featured ? 'text-ivory/70' : 'text-softgray'}`}>
              {t(`descriptions.${tier.key}`)}
            </p>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy/10 bg-ivory p-8">
        <h3 className="text-xl">{t('benefitsTitle')}</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefitKeys.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-navy">
              <span className="mt-0.5 text-champagne-dark" aria-hidden="true">✓</span>
              {t(`benefits.${b}`)}
            </li>
          ))}
        </ul>
        <Link href="/contact" className="btn-primary mt-8">
          {t('cta')}
        </Link>
      </div>
    </Section>
  );
}
