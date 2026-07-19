import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harmonia Foundation',
    short_name: 'EDF',
    description:
      'A global nonprofit foundation empowering lives through education, music, technology, culture, and opportunity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F0',
    theme_color: '#0B1F3A',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
    ]
  };
}
