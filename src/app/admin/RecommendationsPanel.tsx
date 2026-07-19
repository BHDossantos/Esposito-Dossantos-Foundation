'use client';

import { useState } from 'react';

type Recommendation = {
  title: string;
  priority: 'high' | 'medium' | 'low';
  audience: string;
  rationale: string;
  nextStep: string;
};

const PRIORITY: Record<Recommendation['priority'], string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-navy/5 text-navy'
};

export default function RecommendationsPanel() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'notConfigured' | 'error'>('idle');
  const [recs, setRecs] = useState<Recommendation[]>([]);

  async function generate() {
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/recommendations', { method: 'POST' });
      const data = await res.json();
      if (data?.configured === false) {
        setStatus('notConfigured');
        return;
      }
      if (data?.ok && Array.isArray(data.recommendations)) {
        setRecs(data.recommendations);
        setStatus('idle');
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="mb-10 rounded-2xl border border-champagne/40 bg-champagne/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-navy">AI outreach recommendations</h2>
          <p className="text-sm text-softgray">Prioritized next actions generated from your pipeline.</p>
        </div>
        <button type="button" onClick={generate} disabled={status === 'loading'} className="btn-primary">
          {status === 'loading' ? 'Analyzing…' : recs.length ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {status === 'notConfigured' ? (
        <p className="mt-4 text-sm text-softgray">
          Set <code className="text-navy">ANTHROPIC_API_KEY</code> to enable AI recommendations.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="mt-4 text-sm font-medium text-red-700">Something went wrong. Please try again.</p>
      ) : null}

      {recs.length > 0 ? (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {recs.map((r, i) => (
            <li key={i} className="rounded-xl border border-navy/10 bg-warmwhite p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-navy">{r.title}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${PRIORITY[r.priority]}`}>
                  {r.priority}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-champagne-dark">{r.audience}</p>
              <p className="mt-2 text-sm text-softgray">{r.rationale}</p>
              <p className="mt-2 text-sm text-navy">
                <span className="font-semibold">Next step: </span>
                {r.nextStep}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
