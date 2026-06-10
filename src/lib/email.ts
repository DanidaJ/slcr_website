/**
 * Transactional email via Resend's HTTP API (no SDK dependency — a single
 * fetch). Sending is best-effort and *gracefully no-ops* when the env vars are
 * absent, so the inbox feature works in development without email configured.
 *
 * To enable, add to .env.local:
 *   RESEND_API_KEY=re_...
 *   EMAIL_FROM="SLCR <noreply@your-verified-domain>"
 *   APP_URL=https://your-site            # used to link back to the portal
 */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

/** Low-level send. Returns true on success, false (logged) on any failure. */
async function send({ to, subject, html }: SendArgs): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn(`[email] skipped (not configured): "${subject}" → ${to}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`[email] Resend returned ${res.status}:`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

const PORTAL_URL = () =>
  `${(process.env.APP_URL ?? "").replace(/\/$/, "")}/member-portal/inbox`;

function shell(heading: string, intro: string, preview?: string): string {
  const link = PORTAL_URL();
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
    <div style="background:#0f1e3d;padding:24px;border-radius:12px 12px 0 0">
      <h1 style="color:#d4af37;margin:0;font-size:18px">Sri Lanka College of Radiologists</h1>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px">
      <h2 style="margin:0 0 8px;font-size:17px;color:#0f1e3d">${heading}</h2>
      <p style="margin:0 0 16px;line-height:1.5">${intro}</p>
      ${
        preview
          ? `<blockquote style="margin:0 0 16px;padding:12px 16px;background:#f8f9fb;border-left:3px solid #d4af37;color:#374151">${preview}</blockquote>`
          : ""
      }
      <a href="${link}" style="display:inline-block;background:#0f1e3d;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">Open your inbox</a>
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">You're receiving this because you're a member of SLCR. Sign in to view the full message.</p>
    </div>
  </div>`;
}

/** Escape user-supplied text before embedding it in the email HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Notify a member that a new broadcast (announcement) reached their inbox. */
export function notifyBroadcast(to: string, subject: string, body: string) {
  return send({
    to,
    subject: `SLCR announcement: ${subject}`,
    html: shell(
      esc(subject),
      "A new announcement has been posted to your member inbox.",
      esc(body).slice(0, 280)
    ),
  });
}

/** Notify a member that an admin sent them a direct message (maybe a file). */
export function notifyDirectMessage(
  to: string,
  subject: string,
  hasFile: boolean
) {
  return send({
    to,
    subject: `SLCR: ${subject}`,
    html: shell(
      esc(subject),
      hasFile
        ? "You have a new message with an attached file in your member inbox."
        : "You have a new message in your member inbox."
    ),
  });
}
