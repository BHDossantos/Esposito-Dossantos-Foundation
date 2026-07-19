import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const alt = 'Esposito–Dossantos Foundation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OgImage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const tagline = t('title');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'radial-gradient(ellipse at 25% 15%, #15355F 0%, #0B1F3A 45%, #071528 100%)',
          color: '#FAF7F0',
          fontFamily: 'Georgia, serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#C9A86A', fontSize: 30 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#0B1F3A',
              border: '2px solid #C9A86A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 600
            }}
          >
            ED
          </div>
          <div style={{ letterSpacing: 6, textTransform: 'uppercase', fontSize: 22 }}>
            Esposito–Dossantos Foundation
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: 76, fontWeight: 600, lineHeight: 1.05, maxWidth: 1000 }}>
          {tagline}
        </div>
        <div style={{ marginTop: 32, height: 4, width: 160, background: '#C9A86A' }} />
      </div>
    ),
    { ...size }
  );
}
