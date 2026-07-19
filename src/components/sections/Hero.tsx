import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeroFx from '@/components/interactive/HeroFx';
import Scrub from '@/components/interactive/Scrub';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900">
      {/* Cinematic, mouse-tracking backdrop */}
      <HeroFx />

      <div className="container-px relative z-10 pt-28 pb-20">
        <Scrub className="max-w-3xl">
          <p className="eyebrow animate-fade-in text-champagne-light">{t('eyebrow')}</p>
          <h1 className="mt-6 animate-fade-up font-serif text-5xl font-semibold leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-8 max-w-2xl animate-fade-up text-lg leading-relaxed text-ivory/80 sm:text-xl" style={{ animationDelay: '120ms' }}>
            {t('subtitle')}
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-4" style={{ animationDelay: '220ms' }}>
            <Link href="/donate" className="btn-primary">
              {t('donateCta')}
            </Link>
            <Link href="/partners" className="btn-ghost-light">
              {t('partnerCta')}
            </Link>
            <Link href="/mission" className="btn-ghost-light">
              {t('missionCta')}
            </Link>
          </div>
        </Scrub>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="flex flex-col items-center gap-2 text-ivory/50">
          <span className="text-[0.65rem] uppercase tracking-widest2">{t('scroll')}</span>
          <span className="h-10 w-px bg-gradient-to-b from-champagne to-transparent" />
        </div>
      </div>
    </section>
  );
}
