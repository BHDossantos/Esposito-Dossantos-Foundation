// Central definition of the primary navigation. Labels are resolved through
// the `nav` translation namespace so every locale stays in sync.
export const mainNav = [
  { key: 'home', href: '/' },
  { key: 'mission', href: '/mission' },
  { key: 'programs', href: '/programs' },
  { key: 'impact', href: '/impact' },
  { key: 'events', href: '/events' },
  { key: 'blog', href: '/blog' },
  { key: 'partners', href: '/partners' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' }
] as const;

export type NavKey = (typeof mainNav)[number]['key'];
