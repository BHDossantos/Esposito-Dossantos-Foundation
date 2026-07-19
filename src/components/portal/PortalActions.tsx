'use client';

import { useState } from 'react';

export function SignOutButton({ label }: { label: string }) {
  async function signOut() {
    await fetch('/api/portal/logout', { method: 'POST' });
    window.location.href = '/portal/login';
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy transition hover:border-navy hover:bg-navy hover:text-ivory"
    >
      {label}
    </button>
  );
}

export function ManageButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);
  async function manage() {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/manage', { method: 'POST' });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }
  return (
    <button type="button" onClick={manage} disabled={loading} className="btn-secondary">
      {loading ? '…' : label}
    </button>
  );
}
