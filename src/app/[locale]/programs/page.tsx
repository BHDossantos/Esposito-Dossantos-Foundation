import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { Link } from '@/i18n/navigation';
import { pillarIcons } from '@/components/Icons';
import FinalCTA from '@/components/sections/FinalCTA';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'programs');
}

const pillars = ['education', 'music', 'technology', 'community', 'leadership'] as const;

export default async function ProgramsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProgramsContent />;
}

function ProgramsContent() {
  const t = useTranslations('programs');
  const tp = useTranslations('pillars');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')}>
        <Link href="/donate" className="btn-primary">
          {t('hero.donateCta')}
        </Link>
        <Link href="/contact" className="btn-ghost-light">
          {t('hero.applyCta')}
        </Link>
      </PageHero>

      {pillars.map((key, idx) => {
        const Icon = pillarIcons[key];
        return (
          <Section key={key} id={key} tone={idx % 2 === 0 ? 'ivory' : 'white'}>
            <div className="grid gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-champagne">
                  <Icon width={32} height={32} />
                </span>
                <p className="eyebrow mt-6">{t('pillarLabel', { n: idx + 1 })}</p>
                <h2 className="mt-3 text-3xl sm:text-4xl">{tp(`${key}.title`)}</h2>
                <p className="mt-5 text-lg leading-relaxed text-softgray">{tp(`${key}.summary`)}</p>
                <Link href="/donate" className="btn-secondary mt-7">
                  {t('supportThis')}
                </Link>
              </Reveal>
              <div className="lg:col-span-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(['a', 'b', 'c', 'd'] as const).map((item, i) => (
                    <Reveal
                      key={item}
                      delay={i * 70}
                      className="rounded-xl border border-navy/10 bg-warmwhite p-6"
                    >
                      <h3 className="text-lg">{tp(`${key}.offerings.${item}.title`)}</h3>
                      <p className="mt-2 text-sm text-softgray">
                        {tp(`${key}.offerings.${item}.body`)}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        );
      })}

      <FinalCTA />
    </>
  );
}
