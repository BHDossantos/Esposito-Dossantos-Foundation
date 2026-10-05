import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin · Esposito–Dossantos Foundation',
  robots: { index: false, follow: false }
};

// The admin area lives outside the [locale] tree and provides its own document
// shell (the root layout only passes children through).
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-ink">{children}</body>
    </html>
  );
}
