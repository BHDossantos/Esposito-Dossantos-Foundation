'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'notConfigured'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const password = new FormData(e.currentTarget).get('password');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data?.ok) {
        window.location.href = '/admin';
        return;
      }
      setStatus(data?.configured === false ? 'notConfigured' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-2xl font-semibold text-navy">
            Esposito<span className="text-champagne">–</span>Dossantos
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
            Admin
          </p>
        </div>
        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-navy/10 bg-warmwhite p-8 shadow-sm">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
          />
          <button type="submit" disabled={status === 'loading'} className="btn-primary mt-5 w-full">
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
          {status === 'error' ? (
            <p className="mt-3 text-sm font-medium text-red-700" role="alert">
              Invalid password.
            </p>
          ) : null}
          {status === 'notConfigured' ? (
            <p className="mt-3 text-sm text-softgray" role="status">
              Admin access isn’t configured yet. Set the <code className="text-navy">ADMIN_PASSWORD</code>{' '}
              environment variable to enable sign-in.
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
