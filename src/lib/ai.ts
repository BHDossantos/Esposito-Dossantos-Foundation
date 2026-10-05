import type { StoredLead } from './leadStore';

// AI-powered outreach recommendations for the admin team, via the Anthropic API
// (claude-opus-4-8). Gated on ANTHROPIC_API_KEY — returns null when unconfigured
// or on any error, so the dashboard degrades gracefully.

export type Recommendation = {
  title: string;
  priority: 'high' | 'medium' | 'low';
  audience: string;
  rationale: string;
  nextStep: string;
};

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const RESULT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] },
          audience: { type: 'string' },
          rationale: { type: 'string' },
          nextStep: { type: 'string' }
        },
        required: ['title', 'priority', 'audience', 'rationale', 'nextStep']
      }
    }
  },
  required: ['recommendations']
} as const;

/** Compact, privacy-conscious summary of the lead pipeline for the model. */
function summarize(leads: StoredLead[]) {
  const bySource: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const l of leads) {
    bySource[l.source] = (bySource[l.source] ?? 0) + 1;
    if (l.category) byCategory[l.category] = (byCategory[l.category] ?? 0) + 1;
    const s = l.status ?? 'new';
    byStatus[s] = (byStatus[s] ?? 0) + 1;
  }
  return {
    total: leads.length,
    bySource,
    byCategory,
    byStatus,
    recent: leads.slice(0, 15).map((l) => ({
      source: l.source,
      category: l.category,
      status: l.status ?? 'new',
      country: typeof l.data?.country === 'string' ? l.data.country : undefined,
      receivedAt: l.received_at
    }))
  };
}

export async function getRecommendations(
  leads: StoredLead[]
): Promise<Recommendation[] | null> {
  if (!aiConfigured()) return null;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();

    const system =
      'You are a fundraising and development advisor for the Esposito–Dossantos Foundation, ' +
      'a global nonprofit empowering people through education, music, technology, and opportunity. ' +
      'Given an anonymized summary of the CRM pipeline (donors, sponsors, volunteers, scholarship & ' +
      'event applicants, contacts), propose the most valuable next outreach and stewardship actions. ' +
      'Be specific, realistic, and prioritized. Never invent individual donor names or personal details; ' +
      'reason only from the aggregate summary provided.';

    // Some newer request fields (output_config.effort, adaptive thinking) may be
    // ahead of the installed SDK's types, so build params untyped and type the
    // response shape we consume.
    const params = {
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
      max_tokens: 2000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: RESULT_SCHEMA, name: 'recommendations' }
      },
      system,
      messages: [
        {
          role: 'user',
          content:
            'Here is the current pipeline summary as JSON. Return 4–6 prioritized recommendations.\n\n' +
            JSON.stringify(summarize(leads), null, 2)
        }
      ]
    };

    const response = (await client.messages.create(
      params as unknown as Parameters<typeof client.messages.create>[0]
    )) as unknown as { content: Array<{ type: string; text?: string }> };

    const text = response.content
      .filter((b) => b.type === 'text' && typeof b.text === 'string')
      .map((b) => b.text as string)
      .join('');
    if (!text) return null;

    const parsed = JSON.parse(text) as { recommendations?: Recommendation[] };
    return Array.isArray(parsed.recommendations) ? parsed.recommendations : null;
  } catch {
    return null;
  }
}
