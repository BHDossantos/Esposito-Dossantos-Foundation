import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';

export default function FounderStory() {
  const t = useTranslations('home.founders');

  return (
    <Section tone="ivory">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          {/* Elegant portrait placeholder — replace with founder photography */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,168,106,0.25),transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-serif text-2xl text-ivory">Bruno Dossantos</p>
              <p className="text-sm text-champagne-light">{t('founderRole')}</p>
            </div>
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full border border-champagne/40" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow mb-4">{t('eyebrow')}</p>
          <h2 className="text-3xl leading-[1.12] sm:text-4xl">{t('headline')}</h2>
          <p className="mt-6 text-lg leading-relaxed text-softgray">{t('body1')}</p>
          <p className="mt-4 text-lg leading-relaxed text-softgray">{t('body2')}</p>
          <Link href="/about" className="btn-secondary mt-8">
            {t('cta')}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
