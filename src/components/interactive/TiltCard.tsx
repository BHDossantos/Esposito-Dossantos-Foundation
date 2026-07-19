'use client';

import { useRef, type ReactNode } from 'react';
import { canHover, prefersReducedMotion } from '@/lib/motion';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  max?: number;
  /** Render the cursor-following see-through glare. */
  glare?: boolean;
};

// A 3D tilt card that follows the mouse and projects a translucent "glass"
// glare toward the cursor — the see-through highlight. Pointer interaction is
// gated to fine-pointer, motion-allowed devices; everything else renders flat.
export default function TiltCard({
  children,
  className = '',
  max = 7,
  glare = true
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !canHover()) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      raf.current = null;
    });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = '';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt ${className}`}
    >
      {children}
      {glare ? <span className="tilt-glare" aria-hidden="true" /> : null}
    </div>
  );
}
