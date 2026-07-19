'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leadStore';

const STYLES: Record<LeadStatus, string> = {
  new: 'bg-navy/5 text-navy',
  reviewing: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-600'
};

export default function StatusControl({
  id,
  status
}: {
  id: string;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<LeadStatus>(status);
  const [saving, setSaving] = useState(false);

  async function onChange(next: LeadStatus) {
    const prev = value;
    setValue(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) throw new Error('failed');
      router.refresh();
    } catch {
      setValue(prev); // revert on failure
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize outline-none ${STYLES[value]}`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
