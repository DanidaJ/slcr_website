import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Lightweight admin session auth — a self-contained signed token (mini-JWT)
 * using Node's crypto, so we don't pull in an external JWT dependency.
 *
 * Per Next.js 16 guidance, the security boundary lives inside each route
 * handler (via `requireAdmin`), NOT in proxy/middleware.
 */

const ADMIN_COOKIE = "slcr_admin";
const MEMBER_COOKIE = "slcr_member";
const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
const MEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/** Data carried inside a member's signed session token. */
export type MemberSession = {
  memberId: string;
  email: string;
  name?: string;
  /** "admin" members (seeded manually) unlock the admin sections. */
  role: "member" | "admin";
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return base64url(createHmac("sha256", getSecret()).update(payload).digest());
}

/**
 * Verify a token's signature and expiry, returning the decoded payload (or
 * null if invalid). Admin and member tokens are signed with the same secret,
 * so callers MUST also check the `role` claim — see `verifySessionToken` and
 * `getMemberSession`.
 */
function verifyAndDecode(token: string | undefined): Record<string, unknown> | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    if (typeof data.exp !== "number" || Date.now() >= data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

/** Create a signed admin session token valid for ADMIN_MAX_AGE_SECONDS. */
export function createSessionToken(): string {
  const exp = Date.now() + ADMIN_MAX_AGE_SECONDS * 1000;
  const payload = base64url(JSON.stringify({ role: "admin", exp }));
  return `${payload}.${sign(payload)}`;
}

/** Verify a token is a valid, unexpired *admin* token. */
export function verifySessionToken(token: string | undefined): boolean {
  return verifyAndDecode(token)?.role === "admin";
}

/** Create a signed member session token valid for MEMBER_MAX_AGE_SECONDS. */
export function createMemberToken(session: MemberSession): string {
  const exp = Date.now() + MEMBER_MAX_AGE_SECONDS * 1000;
  const payload = base64url(JSON.stringify({ ...session, exp }));
  return `${payload}.${sign(payload)}`;
}

/** Compare a submitted password against ADMIN_SECRET in constant time. */
export function checkAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SECRET environment variable.");
  }
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Whether the caller is an authenticated admin — via either the password-based
 * admin cookie (emergency / legacy) or a Google-authenticated member whose
 * record has role "admin".
 */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  if (verifySessionToken(store.get(ADMIN_COOKIE)?.value)) return true;
  return verifyAndDecode(store.get(MEMBER_COOKIE)?.value)?.role === "admin";
}

/**
 * Guard for route handlers. Returns a 401 Response if not authenticated,
 * or null if the caller is a valid admin.
 */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdmin()) return null;
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

// ─── Member sessions ──────────────────────────────────────────────────────

/** Read the member cookie and return the session payload, or null. */
export async function getMemberSession(): Promise<MemberSession | null> {
  const store = await cookies();
  const data = verifyAndDecode(store.get(MEMBER_COOKIE)?.value);
  if (data?.role !== "member" && data?.role !== "admin") return null;
  const { memberId, email, name, role } = data as Record<string, unknown>;
  if (typeof memberId !== "string" || typeof email !== "string") return null;
  return {
    memberId,
    email,
    name: typeof name === "string" ? name : undefined,
    role: role === "admin" ? "admin" : "member",
  };
}

/**
 * Guard for member-only route handlers. Returns a 401 Response if the caller
 * is not a valid member, or the member session if they are.
 */
export async function requireMember(): Promise<MemberSession | Response> {
  const session = await getMemberSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return session;
}

export async function setMemberCookie(session: MemberSession): Promise<void> {
  const store = await cookies();
  store.set(MEMBER_COOKIE, createMemberToken(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MEMBER_MAX_AGE_SECONDS,
  });
}

export async function clearMemberCookie(): Promise<void> {
  const store = await cookies();
  store.delete(MEMBER_COOKIE);
}
