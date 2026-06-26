import Link from 'next/link';
import './globals.css';

// Global fallback for requests that don't match any locale segment.
// The localized not-found at [locale]/not-found.tsx handles in-app 404s.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-navy-900 text-ivory">
        <div className="px-6 text-center">
          <p className="font-serif text-6xl font-semibold text-champagne">404</p>
          <p className="mt-4 text-lg text-ivory/80">This page could not be found.</p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-champagne px-6 py-3 text-sm font-semibold text-navy-900">
            Return home
          </Link>
        </div>
      </body>
    </html>
  );
}
