import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import { Section } from '@/components/Section';

type LegalSection = { heading: string; body: string };

export default function LegalPage({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const sections = t.raw('sections') as LegalSection[];

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('updated')} />
      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          {sections.map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-2xl">{section.heading}</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-softgray">{section.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
