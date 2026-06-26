import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');

  const year = '2026';

  const columns = [
    {
      title: t('exploreTitle'),
      links: [
        { label: tn('mission'), href: '/mission' },
        { label: tn('programs'), href: '/programs' },
        { label: tn('impact'), href: '/impact' },
        { label: tn('events'), href: '/events' },
        { label: tn('blog'), href: '/blog' }
      ]
    },
    {
      title: t('getInvolvedTitle'),
      links: [
        { label: tn('donate'), href: '/donate' },
        { label: tn('partners'), href: '/partners' },
        { label: t('volunteer'), href: '/contact' },
        { label: tn('contact'), href: '/contact' }
      ]
    },
    {
      title: t('legalTitle'),
      links: [
        { label: t('privacy'), href: '/privacy' },
        { label: t('terms'), href: '/terms' },
        { label: t('cookies'), href: '/cookies' },
        { label: tn('about'), href: '/about' }
      ]
    }
  ];

  return (
    <footer className="bg-navy-900 text-ivory">
      <div className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-2xl font-semibold">
              Esposito<span className="text-champagne">–</span>Dossantos
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest2 text-champagne">
              {tn('foundationLabel')}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
              {t('tagline')}
            </p>
            <p className="mt-6 text-sm text-ivory/60">{t('address')}</p>
            <a
              href="mailto:info@esposito-dossantos.org"
              className="mt-2 inline-block text-sm text-champagne-light hover:text-champagne"
            >
              info@esposito-dossantos.org
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest2 text-champagne">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ivory/75 transition-colors hover:text-champagne-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest2 text-champagne">
              {t('newsletterTitle')}
            </h3>
            <p className="mt-5 text-sm text-ivory/70">{t('newsletterCopy')}</p>
            <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-champagne-light hover:text-champagne">
              {t('joinCta')} →
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Esposito–Dossantos Foundation. {t('rights')}
          </p>
          <p>{t('registration')}</p>
        </div>
      </div>
    </footer>
  );
}
