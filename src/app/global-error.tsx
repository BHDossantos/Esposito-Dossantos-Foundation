'use client';

import './globals.css';

// Catches errors thrown in the root layout itself; provides its own document
// shell. English-only, since the i18n context may be unavailable here.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-navy-900 text-ivory">
        <div className="px-6 text-center">
          <p className="font-serif text-5xl font-semibold text-champagne">!</p>
          <h1 className="mt-4 font-serif text-2xl">Something went wrong</h1>
          <p className="mt-2 text-ivory/70">An unexpected error occurred.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-champagne px-6 py-3 text-sm font-semibold text-navy-900"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
