import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// Helper to build per-page metadata from the `pageMeta` namespace.
// Each page passes its key (e.g. "mission") to resolve title + description.
export async function buildPageMetadata(
  locale: string,
  key: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'pageMeta' });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description }
  };
}
