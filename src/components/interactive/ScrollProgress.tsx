'use client';

import { useEffect, useRef } from 'react';

// Thin champagne reading-progress bar fixed to the top of the viewport.
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let raf = 0;

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      bar!.style.width = `${p}%`;
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
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress__bar" />
    </div>
  );
}
