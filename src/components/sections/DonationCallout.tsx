import { useTranslations } from 'next-intl';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import DonateForm from '@/components/forms/DonateForm';

export default function DonationCallout() {
  const t = useTranslations('home.donate');

  return (
    <Section tone="ivory" id="donate">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4">{t('eyebrow')}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">{t('title')}</h2>
          <p className="mt-6 text-lg leading-relaxed text-softgray">{t('intro')}</p>
          <ul className="mt-8 space-y-4">
            {(['materials', 'mentorship', 'music', 'student'] as const).map((k) => (
              <li key={k} className="flex items-start gap-4">
                <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-champagne/20 text-sm font-semibold text-champagne-dark">
                  ✓
                </span>
                <span className="text-softgray">{t(`points.${k}`)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <DonateForm />
        </Reveal>
      </div>
    </Section>
  );
}
