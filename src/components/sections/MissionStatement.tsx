import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';

export default function MissionStatement() {
  const t = useTranslations('home.mission');

  return (
    <Section tone="white">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4">{t('eyebrow')}</p>
          <h2 className="text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
            {t('headline')}
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-7">
          <p className="text-lg leading-relaxed text-softgray">{t('body1')}</p>
          <p className="mt-5 text-lg leading-relaxed text-softgray">{t('body2')}</p>
          <Link href="/mission" className="btn-secondary mt-8">
            {t('cta')}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
