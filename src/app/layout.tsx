import type { ReactNode } from 'react';
import './globals.css';

// The root layout simply passes children through. The real <html>/<body>
// shell lives in the [locale] layout so the lang attribute can be set
// per-locale. This file is required by the Next.js App Router.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
