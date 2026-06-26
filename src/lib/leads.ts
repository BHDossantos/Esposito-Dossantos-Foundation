import { z } from 'zod';

// Lead categories mirror the CRM segmentation described in the brief.
export const leadCategories = [
  'donor',
  'sponsor',
  'volunteer',
  'school',
  'artist',
  'student',
  'media',
  'grant',
  'general'
] as const;

export const newsletterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  country: z.string().trim().max(120).optional().or(z.literal('')),
  interest: z.string().trim().max(60).optional().or(z.literal(''))
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  country: z.string().trim().max(120).optional().or(z.literal('')),
  inquiryType: z.string().trim().min(1).max(60),
  message: z.string().trim().min(1).max(5000),
  // Honeypot — accepted by the schema so it validates, then checked in the
  // route: any non-empty value means a bot, and we silently fake success.
  company: z.string().max(200).optional()
});

export type Lead = {
  source: 'newsletter' | 'contact';
  category: string;
  data: Record<string, unknown>;
  receivedAt: string;
};

// Single funnel for every captured lead. Today it logs to the server; swap the
// body for your CRM of choice (HubSpot / Salesforce / Airtable / Supabase) or an
// email provider (Resend) — the shape is already normalized for that handoff.
export async function recordLead(lead: Lead): Promise<void> {
  // eslint-disable-next-line no-console
  console.info('[lead]', JSON.stringify(lead));

  // Example integration (uncomment + configure via env):
  //
  // if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
  //   await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ properties: lead.data })
  //   });
  // }
}
