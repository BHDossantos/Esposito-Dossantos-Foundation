import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, adminConfigured, isValidSession } from '@/lib/adminAuth';
import { listLeads, storeConfigured, type StoredLead } from '@/lib/leadStore';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

const SOURCES = ['newsletter', 'contact', 'rsvp', 'application'] as const;

function field(data: Record<string, unknown>, key: string): string {
  const v = data?.[key];
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

export default async function AdminDashboard({
  searchParams
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  // Auth gate
  const cookieStore = await cookies();
  if (!adminConfigured() || !isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const { source } = await searchParams;
  const leads = await listLeads();

  return (
    <main className="min-h-screen">
      <header className="border-b border-navy/10 bg-warmwhite">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-serif text-xl font-semibold text-navy">
              Esposito<span className="text-champagne">–</span>Dossantos · Admin
            </p>
            <p className="text-xs text-softgray">Submissions dashboard</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {leads === null ? (
          <SetupNotice />
        ) : (
          <Dashboard leads={leads} activeSource={source} />
        )}
      </div>
    </main>
  );
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-champagne/30 bg-champagne/5 p-8">
      <h2 className="font-serif text-2xl text-navy">Connect a database to see submissions</h2>
      <p className="mt-3 max-w-2xl text-softgray">
        Sign-in works, but no persistence layer is configured yet, so there are no stored
        submissions to display. Set <code className="text-navy">SUPABASE_URL</code> and{' '}
        <code className="text-navy">SUPABASE_SERVICE_ROLE_KEY</code>, then create the{' '}
        <code className="text-navy">leads</code> table (SQL in{' '}
        <code className="text-navy">src/lib/leadStore.ts</code>). All form submissions —
        donors, volunteers, scholarship and event applications, contacts — will then appear here.
      </p>
      <p className="mt-3 text-sm text-softgray">
        Persistence configured: <strong>{String(storeConfigured())}</strong>
      </p>
    </div>
  );
}

function Dashboard({
  leads,
  activeSource
}: {
  leads: StoredLead[];
  activeSource?: string;
}) {
  const counts = SOURCES.map((s) => ({
    source: s,
    count: leads.filter((l) => l.source === s).length
  }));

  const filtered = activeSource ? leads.filter((l) => l.source === activeSource) : leads;

  return (
    <>
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={leads.length} href="/admin" active={!activeSource} />
        {counts.map((c) => (
          <StatCard
            key={c.source}
            label={labelFor(c.source)}
            value={c.count}
            href={`/admin?source=${c.source}`}
            active={activeSource === c.source}
          />
        ))}
      </div>

      {/* Table */}
      <div className="mt-10 overflow-x-auto rounded-2xl border border-navy/10 bg-warmwhite">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-navy/10 text-xs uppercase tracking-wide text-softgray">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Source</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-softgray">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const d = lead.data || {};
                const detail =
                  field(d, 'message') ||
                  field(d, 'program') ||
                  field(d, 'interest') ||
                  field(d, 'eventTitle') ||
                  '';
                return (
                  <tr key={lead.id} className="border-b border-navy/5 last:border-0 align-top">
                    <td className="whitespace-nowrap px-5 py-3 text-softgray">
                      {new Date(lead.received_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy">
                        {labelFor(lead.source)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy">{lead.category || '—'}</td>
                    <td className="px-5 py-3 text-navy">{field(d, 'name') || '—'}</td>
                    <td className="px-5 py-3 text-navy">{field(d, 'email') || '—'}</td>
                    <td className="max-w-xs truncate px-5 py-3 text-softgray" title={detail}>
                      {detail || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  href,
  active
}: {
  label: string;
  value: number;
  href: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded-2xl border p-5 transition ${
        active ? 'border-champagne bg-champagne/10' : 'border-navy/10 bg-warmwhite hover:border-champagne/40'
      }`}
    >
      <p className="font-serif text-3xl font-semibold text-navy">{value}</p>
      <p className="mt-1 text-sm text-softgray">{label}</p>
    </a>
  );
}

function labelFor(source: string): string {
  switch (source) {
    case 'newsletter':
      return 'Newsletter';
    case 'contact':
      return 'Contact';
    case 'rsvp':
      return 'RSVP';
    case 'application':
      return 'Applications';
    default:
      return source;
  }
}
