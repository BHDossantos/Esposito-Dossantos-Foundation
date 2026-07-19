// Shared guards for motion/interaction effects. All interactive enhancements
// are progressive: they no-op on touch devices and when the user has requested
// reduced motion, so the base experience stays calm and accessible.

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function canHover(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function motionEnabled(): boolean {
  return !prefersReducedMotion();
}
