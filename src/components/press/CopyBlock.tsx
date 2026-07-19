'use client';

import { useState } from 'react';

type CopyBlockProps = {
  label: string;
  text: string;
};

// A boilerplate block journalists can copy in one click. Progressive
// enhancement: the text is always selectable even if the button fails.
export default function CopyBlock({ label, text }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the text remains selectable for manual copy.
    }
  }

  return (
    <div className="rounded-2xl border border-navy/10 bg-warmwhite p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
          {label}
        </p>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-navy/15 px-3 py-1 text-xs font-semibold text-navy
            transition hover:border-champagne hover:text-champagne-dark"
          aria-live="polite"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-4 leading-relaxed text-ink/80">{text}</p>
    </div>
  );
}
