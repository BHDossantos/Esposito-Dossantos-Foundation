import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-36 pb-20 sm:pt-40 sm:pb-24">
      <div className="absolute inset-0">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-champagne/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(21,53,95,0.6),transparent_60%)]" />
      </div>
      <div className="container-px relative z-10">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow text-champagne-light">{eyebrow}</p> : null}
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] text-ivory sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">{intro}</p>
          ) : null}
          {children ? <div className="mt-8 flex flex-wrap gap-4">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
