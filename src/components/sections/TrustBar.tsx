import { useTranslations } from 'next-intl';

export default function TrustBar() {
  const t = useTranslations('home.trust');
  const items = ['global', 'scholarships', 'music', 'education', 'technology', 'community'] as const;

  return (
    <div className="border-y border-navy/10 bg-warmwhite">
      <div className="container-px py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest2 text-softgray">
          {t('label')}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((item) => (
            <span
              key={item}
              className="font-serif text-lg font-medium text-navy/80 sm:text-xl"
            >
              {t(item)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
