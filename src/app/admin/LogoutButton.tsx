'use client';

export default function LogoutButton() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy transition hover:border-navy hover:bg-navy hover:text-ivory"
    >
      Sign out
    </button>
  );
}
