'use client';

import { useEffect, useRef } from 'react';
import { canHover, prefersReducedMotion } from '@/lib/motion';

// Interactive, mouse-tracking hero backdrop. The cursor drives parallax on the
// gradient blobs and a soft champagne spotlight via CSS custom properties, so
// per-frame work is just setting two variables. Falls back to the static
// cinematic gradient on touch / reduced-motion.
export default function HeroFx() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !canHover()) return;

    let raf = 0;
    let nx = 0;
    let ny = 0;

    function onMove(e: MouseEvent) {
      nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      ny = e.clientY / window.innerHeight - 0.5;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el!.style.setProperty('--mx', nx.toFixed(3));
          el!.style.setProperty('--my', ny.toFixed(3));
          el!.style.setProperty('--spot-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
          el!.style.setProperty('--spot-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
          raf = 0;
        });
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hero-fx absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-base animate-slow-zoom" />
      <div className="hero-blob hero-blob--gold" />
      <div className="hero-blob hero-blob--navy" />
      <div className="hero-grid" />
      <div className="hero-spotlight" />
      <div className="hero-fade" />
    </div>
  );
}
