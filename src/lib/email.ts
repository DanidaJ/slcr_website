/**
 * Transactional email. Prefers Gmail SMTP (no domain DNS required); falls
 * back to Resend if configured instead.
 *
 * Sending is best-effort and *gracefully no-ops* when nothing is configured,
 * so inbox/correspondence still work in development without email set up.
 *
 * ─── Gmail (recommended when you can't edit DNS) ───────────────────────
 *   1. Turn on 2-Step Verification for the Gmail account
 *   2. Create an App Password: https://myaccount.google.com/apppasswords
 *      (select Mail → Other → name it "SLCR")
 *   3. Add to .env.local:
 *        GMAIL_USER=you@gmail.com
 *        GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   # 16-char app password
 *        EMAIL_FROM="SLCR <you@gmail.com>"        # usually same as GMAIL_USER
 *        ADMIN_NOTIFY_EMAIL=admin@example.com     # who gets correspondence alerts
 *        APP_URL=http://localhost:3000
 *
 * ─── Resend (only if you can verify a sending domain) ───────────────────
 *   RESEND_API_KEY=re_...
 *   EMAIL_FROM="SLCR <noreply@verified-domain.com>"
 */

import nodemailer from "nodemailer";

export function isEmailConfigured(): boolean {
  return isGmailConfigured() || isResendConfigured();
}

function isGmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

function fromAddress(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.GMAIL_USER?.trim() ||
    "SLCR <noreply@localhost>"
  );
}

async function sendViaGmail({ to, subject, html }: SendArgs): Promise<boolean> {
  const user = process.env.GMAIL_USER!.trim();
  // App passwords are often pasted with spaces; strip them.
  const pass = process.env.GMAIL_APP_PASSWORD!.replace(/\s+/g, "");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: fromAddress(),
    to,
    subject,
    html,
  });
  return true;
}

async function sendViaResend({ to, subject, html }: SendArgs): Promise<boolean> {
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
}

/** Low-level send. Returns true on success, false (logged) on any failure. */
async function send({ to, subject, html }: SendArgs): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn(`[email] skipped (not configured): "${subject}" → ${to}`);
    return false;
  }
  try {
    if (isGmailConfigured()) {
      return await sendViaGmail({ to, subject, html });
    }
    return await sendViaResend({ to, subject, html });
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

const APP_ORIGIN = () => (process.env.APP_URL ?? "").replace(/\/$/, "");
const PORTAL_URL = () => `${APP_ORIGIN()}/member-portal/inbox`;

type ShellArgs = {
  heading: string;
  intro: string;
  preview?: string;
  ctaHref: string;
  ctaLabel: string;
  footer: string;
};

function shell({
  heading,
  intro,
  preview,
  ctaHref,
  ctaLabel,
  footer,
}: ShellArgs): string {
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
      <a href="${ctaHref}" style="display:inline-block;background:#0f1e3d;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">${ctaLabel}</a>
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">${footer}</p>
    </div>
  </div>`;
}

function memberShell(heading: string, intro: string, preview?: string): string {
  return shell({
    heading,
    intro,
    preview,
    ctaHref: PORTAL_URL(),
    ctaLabel: "Open your inbox",
    footer:
      "You're receiving this because you're a member of SLCR. Sign in to view the full message.",
  });
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
    html: memberShell(
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
    html: memberShell(
      esc(subject),
      hasFile
        ? "You have a new message with an attached file in your member inbox."
        : "You have a new message in your member inbox."
    ),
  });
}

export type CorrespondenceNotifyArgs = {
  id: string;
  memberName: string;
  memberEmail: string;
  subject: string;
  body?: string;
  hasFile: boolean;
};

/** Notify an admin that a member sent new correspondence. */
export function notifyCorrespondenceCreated(
  to: string,
  args: CorrespondenceNotifyArgs
) {
  const name = esc(args.memberName);
  const email = esc(args.memberEmail);
  const subject = esc(args.subject);
  const introParts = [
    `<strong>${name}</strong> (${email}) has sent new correspondence.`,
  ];
  if (args.hasFile) {
    introParts.push("An attachment was included.");
  }

  return send({
    to,
    subject: `SLCR correspondence: ${args.subject}`,
    html: shell({
      heading: subject,
      intro: introParts.join(" "),
      preview: args.body ? esc(args.body).slice(0, 280) : undefined,
      ctaHref: `${APP_ORIGIN()}/admin/correspondence/${args.id}`,
      ctaLabel: "Open correspondence",
      footer:
        "You're receiving this because you're an SLCR admin. Sign in to view and reply.",
    }),
  });
}
