import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'about');
}

// Rich-text tag handlers shared across the page.
const rich = {
  b: (chunks: ReactNode) => <strong className="font-semibold text-navy">{chunks}</strong>,
  i: (chunks: ReactNode) => <em>{chunks}</em>
};

// A warm serif pull-quote used to let the story breathe.
function PullQuote({ children }: { children: ReactNode }) {
  return (
    <Reveal as="div" className="my-12">
      <blockquote className="mx-auto max-w-2xl border-l-2 border-champagne pl-6 font-serif text-2xl leading-snug text-navy sm:text-3xl">
        {children}
      </blockquote>
    </Reveal>
  );
}

function Para({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return (
    <p className={`mt-5 leading-relaxed ${lead ? 'text-xl text-ink' : 'text-lg text-ink/80'}`}>
      {children}
    </p>
  );
}

const FOUNDER_KEYS = ['bruno', 'caique', 'giulia'] as const;
const FOUNDER_INITIALS: Record<(typeof FOUNDER_KEYS)[number], string> = {
  bruno: 'B',
  caique: 'C',
  giulia: 'G'
};

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const giuliaBody = t.raw('giulia.body') as string[];

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-navy-900 pt-36 pb-24 sm:pt-44 sm:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-champagne/10 blur-[140px]" />
          <div className="absolute right-0 bottom-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(21,53,95,0.6),transparent_60%)]" />
        </div>
        <div className="container-px relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-champagne-light">{t('hero.eyebrow')}</p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
              {t('hero.titleLine1')}
              <br className="hidden sm:block" /> {t('hero.titleLine2')}
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ivory/75">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── The friendship ───────────────── */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Para lead>{t('friendship.lead')}</Para>
          </Reveal>
          <Reveal>
            <Para>{t('friendship.p1')}</Para>
            <Para>{t('friendship.p2')}</Para>
            <Para>{t('friendship.p3')}</Para>
          </Reveal>

          <PullQuote>{t('friendship.quote1')}</PullQuote>

          <Reveal>
            <Para>{t('friendship.p4')}</Para>
          </Reveal>

          <PullQuote>{t('friendship.quote2')}</PullQuote>

          <Reveal>
            <Para>{t.rich('friendship.outcome', rich)}</Para>
          </Reveal>
        </div>
      </Section>

      {/* ───────────────── A place to belong ───────────────── */}
      <Section tone="ivory">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow text-champagne-dark">{t('belong.eyebrow')}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">{t('belong.title')}</h2>
            <Para>{t('belong.p1')}</Para>
            <Para>{t.rich('belong.p2', rich)}</Para>
            <Para>{t('belong.p3')}</Para>
            <Para>{t('belong.p4')}</Para>
          </Reveal>
          <PullQuote>{t('belong.quote')}</PullQuote>
        </div>
      </Section>

      {/* ───────────────── The founders ───────────────── */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-champagne-dark">{t('founders.eyebrow')}</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">{t('founders.title')}</h2>
          <p className="mt-6 text-lg leading-relaxed text-softgray">{t('founders.intro')}</p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
          {FOUNDER_KEYS.map((key, i) => (
            <Reveal as="div" key={key} delay={i * 90}>
              <div className="h-full rounded-2xl border border-navy/10 bg-warmwhite p-8 text-center transition hover:border-champagne/40 hover:shadow-lg hover:shadow-navy/5">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-champagne font-serif text-2xl font-semibold text-champagne-dark">
                  {FOUNDER_INITIALS[key]}
                </span>
                <h3 className="mt-5 font-serif text-xl text-navy">
                  {t(`founders.members.${key}.name`)}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                  {t(`founders.members.${key}.role`)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-softgray">
                  {t(`founders.members.${key}.bio`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <Para>{t('founders.closing')}</Para>
        </Reveal>

        <PullQuote>{t('founders.quote')}</PullQuote>
      </Section>

      {/* ───────────────── Donate CTA ───────────────── */}
      <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,168,106,0.16),transparent_60%)]" />
        <div className="container-px relative z-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-champagne-light">{t('donateCta.eyebrow')}</p>
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
              {t('donateCta.title')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
              {t('donateCta.body')}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/donate" className="btn-primary">
                {t('donateCta.donate')}
              </Link>
              <Link href="/partners" className="btn-ghost-light">
                {t('donateCta.partner')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── Bruno's letter ───────────────── */}
      <Section tone="ivory">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="eyebrow text-champagne-dark">{t('letter.eyebrow')}</p>
            <blockquote className="mx-auto mt-6 max-w-2xl font-serif text-2xl leading-snug text-navy sm:text-3xl">
              &ldquo;{t('letter.quote')}&rdquo;
            </blockquote>
          </Reveal>

          <div className="mt-12">
            <Reveal>
              <Para lead>{t('letter.lead')}</Para>
              <Para>{t('letter.p1')}</Para>
            </Reveal>

            <PullQuote>{t('letter.quote2')}</PullQuote>

            <Reveal>
              <h3 className="mt-10 font-serif text-xl text-navy">{t('letter.h1')}</h3>
              <Para>{t('letter.p2')}</Para>
              <Para>{t('letter.p3')}</Para>

              <h3 className="mt-10 font-serif text-xl text-navy">{t('letter.h2')}</h3>
              <Para>{t('letter.p4')}</Para>
              <Para>{t('letter.p5')}</Para>

              <h3 className="mt-10 font-serif text-xl text-navy">{t('letter.h3')}</h3>
              <Para>{t.rich('letter.p6', rich)}</Para>
              <Para>{t('letter.p7')}</Para>
            </Reveal>

            <PullQuote>{t('letter.quote3')}</PullQuote>

            <Reveal>
              <p className="mt-10 font-serif text-lg text-navy">{t('letter.name')}</p>
              <p className="text-sm text-champagne-dark">{t('letter.role')}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ───────────────── Giulia's message ───────────────── */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="eyebrow text-champagne-dark">{t('giulia.eyebrow')}</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-4xl">
              {t('giulia.title')}
            </h2>
          </Reveal>
          <div className="mt-10">
            {giuliaBody.map((para, i) => (
              <Reveal as="div" key={i}>
                <Para lead={i === 0}>{para}</Para>
              </Reveal>
            ))}
            <Reveal>
              <p className="mt-10 font-serif text-lg text-navy">{t('giulia.name')}</p>
              <p className="text-sm text-champagne-dark">{t('giulia.role')}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ───────────────── Final invitation ───────────────── */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">{t('finalCta.title')}</h2>
          <p className="mt-5 text-lg leading-relaxed text-softgray">{t('finalCta.body')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary">
              {t('finalCta.donate')}
            </Link>
            <Link href="/contact" className="btn-secondary">
              {t('finalCta.contact')}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
