/**
 * Transactional email. Prefers Resend (sends from our own verified domain,
 * so mail lands in the inbox and there's no Gmail daily cap); falls back to
 * Gmail SMTP when Resend isn't configured, e.g. in local development.
 *
 * Sending is best-effort and *gracefully no-ops* when nothing is configured,
 * so inbox/correspondence still work in development without email set up.
 *
 * ─── Resend (production) ────────────────────────────────────────────────
 *   radiologist.lk is verified in Resend (DKIM/SPF records live in Vercel DNS).
 *     RESEND_API_KEY=re_...
 *     EMAIL_FROM="SLCR <noreply@radiologist.lk>"
 *     EMAIL_REPLY_TO=someone@example.com       # optional — a monitored inbox
 *
 * ─── Gmail (fallback) ───────────────────────────────────────────────────
 *   1. Turn on 2-Step Verification for the Gmail account
 *   2. Create an App Password: https://myaccount.google.com/apppasswords
 *   3. Add to .env.local (mail is sent from GMAIL_USER; EMAIL_FROM is ignored):
 *        GMAIL_USER=you@gmail.com
 *        GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   # 16-char app password
 *
 * Only one transport is used per deployment — Resend whenever it's
 * configured. A failed Resend send is logged, not retried through Gmail.
 *
 * Also used by both:
 *   ADMIN_NOTIFY_EMAIL=admin@example.com     # who gets correspondence alerts
 *   APP_URL=http://localhost:3000
 */

import nodemailer from "nodemailer";

export function isEmailConfigured(): boolean {
  return isResendConfigured() || isGmailConfigured();
}

function isGmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type Email = {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative — HTML-only mail scores worse with spam filters. */
  text: string;
  /** Overrides EMAIL_REPLY_TO for this message. */
  replyTo?: string;
};

/** Resend sender — must be an address on the verified domain. */
function resendFrom(): string {
  return process.env.EMAIL_FROM!.trim();
}

/**
 * Gmail sender. Always the authenticated account itself: Gmail rewrites any
 * other From address anyway, and EMAIL_FROM points at the Resend domain.
 */
function gmailFrom(): string {
  return `SLCR <${process.env.GMAIL_USER!.trim()}>`;
}

function replyTo(email: Email): string | undefined {
  return email.replyTo || process.env.EMAIL_REPLY_TO?.trim() || undefined;
}

function gmailTransport() {
  const user = process.env.GMAIL_USER!.trim();
  // App passwords are often pasted with spaces; strip them.
  const pass = process.env.GMAIL_APP_PASSWORD!.replace(/\s+/g, "");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

function gmailMessage(email: Email) {
  const { to, subject, html, text } = email;
  return { from: gmailFrom(), replyTo: replyTo(email), to, subject, html, text };
}

async function sendViaGmail(email: Email): Promise<boolean> {
  await gmailTransport().sendMail(gmailMessage(email));
  return true;
}

function resendMessage(email: Email) {
  const { to, subject, html, text } = email;
  // `reply_to: undefined` is dropped by JSON.stringify.
  return { from: resendFrom(), reply_to: replyTo(email), to, subject, html, text };
}

async function resendPost(path: string, payload: unknown): Promise<boolean> {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error(`[email] Resend returned ${res.status}:`, await res.text());
    return false;
  }
  return true;
}

function sendViaResend(email: Email): Promise<boolean> {
  return resendPost("/emails", resendMessage(email));
}

/** Low-level send. Returns true on success, false (logged) on any failure. */
async function send(email: Email): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn(`[email] skipped (not configured): "${email.subject}" → ${email.to}`);
    return false;
  }
  try {
    if (isResendConfigured()) {
      return await sendViaResend(email);
    }
    return await sendViaGmail(email);
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

/** Resend's batch endpoint accepts at most 100 emails per request. */
const RESEND_BATCH_SIZE = 100;
/** Pause between batch requests to stay under Resend's per-second rate limit. */
const RESEND_BATCH_PAUSE_MS = 600;

/**
 * Send many emails without bursting them all out at once. Returns how many
 * were accepted; failures are logged, never thrown.
 */
async function sendMany(emails: Email[]): Promise<number> {
  if (emails.length === 0) return 0;
  if (!isEmailConfigured()) {
    console.warn(`[email] skipped (not configured): ${emails.length} emails`);
    return 0;
  }

  let sent = 0;
  if (isResendConfigured()) {
    for (let i = 0; i < emails.length; i += RESEND_BATCH_SIZE) {
      if (i > 0) await new Promise((r) => setTimeout(r, RESEND_BATCH_PAUSE_MS));
      const chunk = emails.slice(i, i + RESEND_BATCH_SIZE);
      try {
        if (await resendPost("/emails/batch", chunk.map(resendMessage))) {
          sent += chunk.length;
        }
      } catch (err) {
        console.error("[email] batch send failed:", err);
      }
    }
    return sent;
  }

  // Gmail: one connection, one message at a time.
  const transport = gmailTransport();
  for (const email of emails) {
    try {
      await transport.sendMail(gmailMessage(email));
      sent++;
    } catch (err) {
      console.error(`[email] send failed → ${email.to}:`, err);
    }
  }
  transport.close();
  return sent;
}

const APP_ORIGIN = () => (process.env.APP_URL ?? "").replace(/\/$/, "");
const PORTAL_URL = () => `${APP_ORIGIN()}/member-portal/inbox`;
const LOGIN_URL = () => `${APP_ORIGIN()}/membership/member-login`;

const ORG_NAME = "Sri Lanka College of Radiologists";

type ShellArgs = {
  heading: string;
  intro: string;
  preview?: string;
  ctaHref: string;
  ctaLabel: string;
  /** Optional guidance rendered between the CTA and the footer. */
  note?: string;
  footer: string;
};

/** Build both the HTML and plain-text bodies from the same content. */
function shell(args: ShellArgs): Pick<Email, "html" | "text"> {
  return { html: shellHtml(args), text: shellText(args) };
}

function shellHtml({
  heading,
  intro,
  preview,
  ctaHref,
  ctaLabel,
  note,
  footer,
}: ShellArgs): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
    <div style="background:#0f1e3d;padding:24px;border-radius:12px 12px 0 0">
      <h1 style="color:#d4af37;margin:0;font-size:18px">${ORG_NAME}</h1>
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
      ${
        note
          ? `<p style="margin:18px 0 0;line-height:1.5;font-size:13px;color:#374151">${note}</p>`
          : ""
      }
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">${footer}</p>
    </div>
  </div>`;
}

function shellText({
  heading,
  intro,
  preview,
  ctaHref,
  ctaLabel,
  note,
  footer,
}: ShellArgs): string {
  return [
    ORG_NAME,
    heading,
    intro,
    preview,
    `${ctaLabel}: ${ctaHref}`,
    note,
    footer,
  ]
    .filter(Boolean)
    .map((part) => htmlToText(part!))
    .join("\n\n");
}

/** Turn the small HTML fragments used in the templates into plain text. */
function htmlToText(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function memberShell(heading: string, intro: string, preview?: string) {
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

/**
 * Notify every recipient that a new broadcast (announcement) reached their
 * inbox. Each member gets their own email; sent in batches, not all at once.
 */
export function notifyBroadcast(to: string[], subject: string, body: string) {
  const content = memberShell(
    esc(subject),
    "A new announcement has been posted to your member inbox.",
    esc(body).slice(0, 280)
  );
  return sendMany(
    to.map((recipient) => ({
      to: recipient,
      subject: `SLCR announcement: ${subject}`,
      ...content,
    }))
  );
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
    ...memberShell(
      esc(subject),
      hasFile
        ? "You have a new message with an attached file in your member inbox."
        : "You have a new message in your member inbox."
    ),
  });
}

export type MemberApprovedArgs = {
  to: string;
  name?: string;
  memberNumber?: string;
  /** Temporary password — only passed when one was just assigned. */
  password?: string;
};

/**
 * Notify an applicant that an admin approved their membership, and hand them
 * the temporary password assigned at approval. Sent on the pending → active
 * transition, so the CTA points at sign-in (they have no session yet).
 */
export function notifyMemberApproved({
  to,
  name,
  memberNumber,
  password,
}: MemberApprovedArgs) {
  const who = name?.trim();
  const intro = [
    who ? `Dear ${esc(who)},` : "Hello,",
    "your application for membership of the Sri Lanka College of Radiologists has been approved.",
    memberNumber?.trim()
      ? `Your membership number is <strong>${esc(memberNumber.trim())}</strong>.`
      : "",
    password
      ? "You can now sign in to the member portal with the details below."
      : "You can now sign in to the member portal.",
  ]
    .filter(Boolean)
    .join(" ");

  const credentials = password
    ? `Username: <strong>${esc(to)}</strong><br />Temporary password: <strong>${esc(password)}</strong>`
    : undefined;

  const note = [
    password
      ? "For your security, please change this password as soon as you sign in — you can do it under <strong>Change Password</strong> on your member profile page."
      : "",
    "If your email address is a Gmail address, you can skip the password altogether and use the <strong>Continue with Google</strong> option on the sign-in page.",
  ]
    .filter(Boolean)
    .join(" ");

  return send({
    to,
    subject: "Your SLCR membership has been approved",
    ...shell({
      heading: "Membership approved",
      intro,
      preview: credentials,
      ctaHref: LOGIN_URL(),
      ctaLabel: "Sign in to the member portal",
      note,
      footer:
        "You're receiving this because you applied for SLCR membership. If you didn't apply, please contact us.",
    }),
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
    // Let the admin reply straight to the member from their mail client.
    replyTo: args.memberEmail,
    ...shell({
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
