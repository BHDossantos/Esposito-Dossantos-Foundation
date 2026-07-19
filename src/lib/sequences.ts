// Automated email sequences. Each sequence is an ordered list of steps with a
// send offset (afterDays). Step 0 (afterDays: 0) fires immediately on capture;
// later steps are sent by the cron engine (/api/cron/email-sequences) as they
// come due. Keyed by lead source.

export type SequenceStep = {
  afterDays: number;
  subject: string;
  heading: string;
  paragraphs: string[];
};

export const SEQUENCES: Record<string, SequenceStep[]> = {
  newsletter: [
    {
      afterDays: 0,
      subject: 'Welcome to the Harmonia Foundation',
      heading: 'Welcome to the movement',
      paragraphs: [
        'Thank you for joining the Harmonia Foundation. You are now part of a global community working to empower lives through education, music, technology, and opportunity.',
        'We believe talent exists everywhere, but opportunity does not — and together we can close that gap. We will keep you updated on our programs, events, and the impact you help create.'
      ]
    },
    {
      afterDays: 3,
      subject: 'The work your support makes possible',
      heading: 'Where opportunity begins',
      paragraphs: [
        'From scholarships and instruments to mentorship and technology access, every program we run removes a real barrier and opens a real door.',
        'If our mission resonates with you, consider making a gift or exploring ways to get involved. Every contribution turns potential into opportunity.'
      ]
    }
  ],
  application: [
    {
      afterDays: 0,
      subject: 'We received your application',
      heading: 'Thank you for applying',
      paragraphs: [
        'We have received your application to the Harmonia Foundation. Thank you for taking this step — we are honored to consider it.',
        'Our team reviews every application with care. We will be in touch as your application moves through our process.'
      ]
    },
    {
      afterDays: 5,
      subject: 'Your application — what happens next',
      heading: 'What happens next',
      paragraphs: [
        'A quick note to let you know your application is in good hands. Our team is reviewing submissions and will follow up with next steps soon.',
        'In the meantime, feel free to explore our programs and community. We are grateful you reached out.'
      ]
    }
  ]
};

export function stepHtml(step: SequenceStep): string {
  const body = step.paragraphs
    .map((p) => `<p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">${p}</p>`)
    .join('');
  return `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
      <p style="font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:#A8884B;margin:0 0 8px;">Harmonia Foundation</p>
      <h1 style="font-size:22px;color:#0B1F3A;margin:0 0 16px;">${step.heading}</h1>
      ${body}
      <p style="margin:28px 0 0;">
        <a href="https://harmonia-foundation.org/donate" style="background:#C9A86A;color:#0B1F3A;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:999px;">Support our mission</a>
      </p>
      <p style="color:#9ca3af;font-size:12px;margin-top:28px;">You are receiving this because you connected with the Harmonia Foundation. To unsubscribe, reply to this email.</p>
    </div>`;
}
