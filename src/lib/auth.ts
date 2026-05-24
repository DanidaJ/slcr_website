import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Lightweight admin session auth — a self-contained signed token (mini-JWT)
 * using Node's crypto, so we don't pull in an external JWT dependency.
 *
 * Per Next.js 16 guidance, the security boundary lives inside each route
 * handler (via `requireAdmin`), NOT in proxy/middleware.
 */

const COOKIE_NAME = "slcr_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

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

/** Create a signed session token valid for MAX_AGE_SECONDS. */
export function createSessionToken(): string {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = base64url(JSON.stringify({ role: "admin", exp }));
  return `${payload}.${sign(payload)}`;
}

/** Verify a token's signature and expiry. Returns true only if valid. */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
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

/** Read the session cookie and return whether the caller is an authenticated admin. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
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
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
