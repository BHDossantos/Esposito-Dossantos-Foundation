import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { getAllPosts, getAllSlugs, getPost } from '@/content/posts';
import type { Locale } from '@/i18n/routing';
import { baseUrl, breadcrumbSchema, localizedUrl } from '@/lib/schema';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: 'article', title: post.title, description: post.excerpt },
    twitter: { title: post.title, description: post.excerpt }
  };
}

export default async function PostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(locale as Locale, slug);
  if (!post) notFound();

  const t = await getTranslations('blog');
  const format = await getFormatter();
  const related = getAllPosts(locale as Locale)
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const articleUrl = localizedUrl(locale, `/blog/${slug}`);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    url: articleUrl,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'NGO',
      name: 'Harmonia Foundation',
      url: baseUrl
    }
  };

  const breadcrumbs = breadcrumbSchema(locale, [
    { name: 'Home', path: '' },
    { name: t('hero.title'), path: '/blog' },
    { name: post.title, path: `/blog/${slug}` }
  ]);

  return (
    <>
      <article>
        {/* Header */}
        <header className="relative overflow-hidden bg-navy-900 pt-36 pb-16 sm:pt-40">
          <div className={`absolute inset-0 bg-gradient-to-br ${post.cover} opacity-90`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,168,106,0.18),transparent_60%)]" />
          <div className="container-px relative z-10">
            <div className="mx-auto max-w-3xl">
              <Link href="/blog" className="text-sm font-medium text-champagne-light hover:text-champagne">
                ← {t('backToBlog')}
              </Link>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest2 text-champagne-light">
                {post.category}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] text-ivory sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-6 text-sm text-ivory/70">
                {t('published')} {format.dateTime(new Date(post.date), { dateStyle: 'long' })} ·{' '}
                {post.readingMinutes} {t('minuteRead')} · {post.author}
              </p>
            </div>
          </div>
        </header>

        {/* Body */}
        <Section tone="white">
          <div className="mx-auto max-w-3xl">
            {post.body.map((para, i) => (
              <p
                key={i}
                className={`leading-relaxed text-ink/80 ${i === 0 ? 'text-xl text-ink' : 'mt-6 text-lg'}`}
              >
                {para}
              </p>
            ))}
          </div>
        </Section>
      </article>

      {/* Related */}
      {related.length > 0 ? (
        <Section tone="ivory">
          <h2 className="text-2xl">{t('related')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {related.map((post, i) => (
              <Reveal as="div" key={post.slug} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex gap-5 rounded-2xl border border-navy/10 bg-warmwhite p-5 transition hover:border-champagne/40"
                >
                  <div className={`h-24 w-24 flex-none rounded-xl bg-gradient-to-br ${post.cover}`} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-champagne-dark">
                      {post.category}
                    </p>
                    <h3 className="mt-1 font-serif text-lg leading-snug text-navy group-hover:text-champagne-dark">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-softgray">{post.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <FinalCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
