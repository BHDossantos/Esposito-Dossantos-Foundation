import type { ReactNode } from 'react';
import Reveal from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark'
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow ? (
        <p
          className={`eyebrow mb-4 ${tone === 'light' ? 'text-champagne-light' : ''}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-3xl leading-[1.1] sm:text-4xl lg:text-5xl ${
          tone === 'light' ? 'text-ivory' : ''
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-6 text-lg leading-relaxed ${
            tone === 'light' ? 'text-ivory/80' : 'text-softgray'
          }`}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: 'ivory' | 'white' | 'navy';
};

const toneClasses: Record<NonNullable<SectionProps['tone']>, string> = {
  ivory: 'bg-ivory text-ink',
  white: 'bg-warmwhite text-ink',
  navy: 'bg-navy-800 text-ivory'
};

export function Section({
  children,
  id,
  className = '',
  tone = 'ivory'
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-20 sm:py-24 lg:py-28 ${toneClasses[tone]} ${className}`}
    >
      <div className="container-px">{children}</div>
    </section>
  );
}
