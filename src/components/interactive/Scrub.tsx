'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

type ScrubProps = {
  children: ReactNode;
  className?: string;
  /** How far (px) the content recedes in Z over the scrub range. */
  depth?: number;
  /** Max upward drift (px). */
  lift?: number;
  /** Max X-axis rotation (deg) for the 3D recede. */
  rotate?: number;
};

// Scroll-scrubbed 3D recede. As the page scrolls through the first viewport,
// the wrapped content drifts up, tilts back, and fades — tied directly to
// scroll position (scrubbed), not a one-shot trigger.
export default function Scrub({
  children,
  className = '',
  depth = 140,
  lift = 70,
  rotate = 8
}: ScrubProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;

    function update() {
      const vh = window.innerHeight || 1;
      const p = Math.min(Math.max(window.scrollY / (vh * 0.9), 0), 1); // 0..1
      el!.style.transform = `perspective(1200px) translate3d(0, ${(-lift * p).toFixed(1)}px, ${(-depth * p).toFixed(1)}px) rotateX(${(rotate * p).toFixed(2)}deg)`;
      el!.style.opacity = String(1 - p * 0.8);
      raf = 0;
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [depth, lift, rotate]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
