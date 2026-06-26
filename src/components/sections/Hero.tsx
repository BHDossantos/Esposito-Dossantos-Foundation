import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900">
      {/* Cinematic gradient backdrop (placeholder for hero video / photography) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-slow-zoom bg-[radial-gradient(ellipse_at_30%_20%,#15355F_0%,#0B1F3A_45%,#071528_100%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%221%22 cy=%221%22 r=%220.5%22 fill=%22%23C9A86A%22 opacity=%220.15%22/></svg>')] opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-navy-900 to-transparent" />
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-champagne/10 blur-[120px]" />
      </div>

      <div className="container-px relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
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
        </div>
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
