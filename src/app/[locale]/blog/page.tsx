import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import TiltCard from '@/components/interactive/TiltCard';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { buildPageMetadata } from '@/lib/metadata';
import { getAllPosts } from '@/content/posts';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'blog');
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('blog');
  const format = await getFormatter();
  const posts = getAllPosts(locale as Locale);

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

      <Section tone="white">
        {posts.length === 0 ? (
          <p className="text-center text-softgray">{t('empty')}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="div" key={post.slug} delay={i * 70} className="h-full">
                <TiltCard className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-warmwhite shadow-sm">
                  <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                    <div className={`relative aspect-[16/10] bg-gradient-to-br ${post.cover}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,168,106,0.25),transparent_60%)]" />
                      <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs text-softgray">
                        {format.dateTime(new Date(post.date), { dateStyle: 'long' })} ·{' '}
                        {post.readingMinutes} {t('minuteRead')}
                      </p>
                      <h2 className="mt-3 font-serif text-2xl leading-snug text-navy transition-colors group-hover:text-champagne-dark">
                        {post.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-softgray">{post.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-champagne-dark">
                        {t('readMore')} <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <NewsletterSection />
    </>
  );
}
