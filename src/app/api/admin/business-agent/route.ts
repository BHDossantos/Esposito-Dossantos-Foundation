import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ADMIN_COOKIE, isValidSession } from '@/lib/adminAuth';
import { listLeads } from '@/lib/leadStore';
import { BUSINESS_AGENT, BUSINESS_AGENTS } from '@/lib/agent/charter';
import { SHARED_APPROVALS, runBusinessTask, type Evidence } from '@/lib/agent/core';
import { agentOffReason, providerFromEnv } from '@/lib/agent/provider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The Foundation's business agent (ported from Jennifer). Admin session only.
// Off until BUSINESS_AGENT_ENABLED=true and ANTHROPIC_API_KEY are set on the
// server. It only proposes: the result is returned here and nothing is sent,
// posted, stored or changed. The model sees lead counts only, never names or
// contact details.

async function isAdmin() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  return NextResponse.json({ ok: true, agents: BUSINESS_AGENTS, sharedApprovals: SHARED_APPROVALS, off: agentOffReason() });
}

const Body = z.object({
  /** 'foundation' (default) or 'nonprofit' for the United Youth Orchestra agent. */
  agent: z.string().max(40).optional(),
  taskId: z.string().max(40),
  /** Optional notes from the admin, such as replies to look at. Treated as untrusted. */
  notes: z.string().max(8000).optional()
});

async function pipelineCounts(): Promise<Evidence[]> {
  const leads = (await listLeads(500)) ?? [];
  if (!leads.length) return [];
  const tally = (key: (l: (typeof leads)[number]) => string | undefined) => {
    const out: Record<string, number> = {};
    for (const l of leads) {
      const k = key(l);
      if (k) out[k] = (out[k] ?? 0) + 1;
    }
    return Object.entries(out).map(([k, n]) => `${k}: ${n}`).join(', ');
  };
  return [{
    sourceId: 'crm:pipeline',
    title: 'Foundation pipeline counts (latest 500 records)',
    trusted: true,
    text: `Records: ${leads.length}. By source: ${tally((l) => l.source)}. By category: ${tally((l) => l.category ?? undefined)}. By status: ${tally((l) => l.status ?? 'new')}.`
  }];
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  const off = agentOffReason();
  if (off) return NextResponse.json({ ok: false, off }, { status: 503 });

  const evidence = await pipelineCounts();
  if (parsed.data.notes) evidence.push({ sourceId: 'admin:notes', title: 'Notes from the admin', text: parsed.data.notes });
  const agent = BUSINESS_AGENTS.find((a) => a.companyId === parsed.data.agent) ?? BUSINESS_AGENT;
  const result = await runBusinessTask({
    agent,
    taskId: parsed.data.taskId,
    evidence,
    model: providerFromEnv({ ...process.env, BUSINESS_AGENT_MODEL: process.env.BUSINESS_AGENT_MODEL || process.env.ANTHROPIC_MODEL })
  });
  return NextResponse.json({ ok: true, result });
}
