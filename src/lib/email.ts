// Minimal transactional email via Resend (REST, no SDK). No-op when unconfigured.
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || 'Harmonia Foundation <noreply@harmonia-foundation.org>';

export function emailConfigured(): boolean {
  return Boolean(RESEND_KEY);
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
        Harmonia Foundation. This link expires in 15 minutes.
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
