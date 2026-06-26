import { useTranslations } from 'next-intl';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import NewsletterForm from '@/components/forms/NewsletterForm';

export default function NewsletterSection() {
  const t = useTranslations('newsletter');

  return (
    <Section tone="ivory" id="newsletter">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4">{t('eyebrow')}</p>
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-5 text-lg leading-relaxed text-softgray">{t('intro')}</p>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-7">
          <NewsletterForm />
        </Reveal>
      </div>
    </Section>
  );
}
