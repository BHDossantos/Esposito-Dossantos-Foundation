import { ImageResponse } from 'next/og';
import { getAllSlugs, getPost } from '@/content/posts';
import type { Locale } from '@/i18n/routing';

export const alt = 'Harmonia Foundation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogOgImage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const post = getPost(locale as Locale, slug);
  const title = post?.title ?? 'Harmonia Foundation';
  const category = post?.category ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background:
            'radial-gradient(ellipse at 25% 15%, #15355F 0%, #0B1F3A 45%, #071528 100%)',
          color: '#FAF7F0',
          fontFamily: 'Georgia, serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#C9A86A' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: '#0B1F3A',
              border: '2px solid #C9A86A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 600
            }}
          >
            H
          </div>
          <div style={{ letterSpacing: 6, textTransform: 'uppercase', fontSize: 20 }}>
            Harmonia Foundation
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {category ? (
            <div
              style={{
                color: '#C9A86A',
                fontSize: 24,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 20
              }}
            >
              {category}
            </div>
          ) : null}
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.08, maxWidth: 1040 }}>
            {title}
          </div>
        </div>

        <div style={{ height: 4, width: 160, background: '#C9A86A' }} />
      </div>
    ),
    { ...size }
  );
}
