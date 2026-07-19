'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { mainNav } from '@/lib/nav';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-navy/10 bg-ivory/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-px">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group flex flex-col leading-none" aria-label={t('home')}>
            <span className="font-serif text-xl font-semibold tracking-tight text-navy sm:text-2xl">
              Harmonia
            </span>
            <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-widest2 text-champagne-dark">
              {t('foundationLabel')}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {mainNav.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-champagne-dark ${
                    active ? 'text-champagne-dark' : 'text-navy'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LocaleSwitcher />
            <Link href="/donate" className="btn-primary">
              {t('donate')}
            </Link>
          </div>

          <button
            type="button"
            className="flex items-center justify-center rounded-md p-2 text-navy lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex h-5 w-6 flex-col justify-between">
              <span className={`h-0.5 w-full bg-navy transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-full bg-navy transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-navy transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-navy/10 bg-ivory lg:hidden">
          <nav className="container-px flex flex-col py-4" aria-label="Mobile">
            {mainNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="border-b border-navy/5 py-3 text-base font-medium text-navy"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-5 flex items-center justify-between">
              <LocaleSwitcher />
              <Link href="/donate" className="btn-primary">
                {t('donate')}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
