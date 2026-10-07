// Minimal transactional email via Resend (REST, no SDK). No-op when unconfigured.
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || 'Esposito–Dossantos Foundation <noreply@espositodossantosfoundation.org>';
// Internal address that receives a copy of every submission. Set
// LEADS_NOTIFY_EMAIL in the environment to your inbox.
const NOTIFY = process.env.LEADS_NOTIFY_EMAIL;

export function emailConfigured(): boolean {
  return Boolean(RESEND_KEY);
}

// Send the team an internal copy of a submission. No-op when Resend or the
// notification address is not configured.
export async function notifyTeam(subject: string, html: string): Promise<boolean> {
  if (!NOTIFY) return false;
  return sendEmail(NOTIFY, subject, html);
}

// Render a simple key/value table of a submission for the internal copy.
export function submissionHtml(title: string, fields: Record<string, unknown>): string {
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      const value = Array.isArray(v)
        ? v.map((item) => escapeHtml(String(item))).join('<br>')
        : escapeHtml(String(v));
      return `<tr><td style="padding:6px 12px 6px 0;color:#9ca3af;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(
        k
      )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${value}</td></tr>`;
    })
    .join('');
  return `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:620px;margin:0 auto;padding:24px;">
      <h1 style="font-size:18px;color:#0B1F3A;">${escapeHtml(title)}</h1>
      <table style="border-collapse:collapse;width:100%;">${rows}</table>
    </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_KEY) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: FROM, to, subject, html })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendMagicLink(to: string, url: string): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 20px; color: #0B1F3A;">Sign in to your donor portal</h1>
      <p style="color: #4b5563; line-height: 1.6;">
        Click the button below to securely access your giving history with the
        Esposito–Dossantos Foundation. This link expires in 15 minutes.
      </p>
      <p style="margin: 28px 0;">
        <a href="${url}" style="background: #C9A86A; color: #0B1F3A; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 999px;">
          Access my portal
        </a>
      </p>
      <p style="color: #9ca3af; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
    </div>`;
  return sendEmail(to, 'Your donor portal sign-in link', html);
}
