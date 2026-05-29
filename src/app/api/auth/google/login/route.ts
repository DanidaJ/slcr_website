import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { buildAuthUrl, getRedirectUri } from "@/lib/google";

// OAuth depends on per-request cookies — never prerender.
export const dynamic = "force-dynamic";

/** Short-lived cookie holding the CSRF `state` and OIDC `nonce`. */
const OAUTH_COOKIE = "slcr_oauth";
const OAUTH_TTL_SECONDS = 60 * 10; // 10 minutes to complete the flow

/** Kick off Google sign-in: set a state/nonce cookie and redirect to Google. */
export async function GET(request: NextRequest) {
  const state = randomBytes(16).toString("hex");
  const nonce = randomBytes(16).toString("hex");

  const store = await cookies();
  store.set(OAUTH_COOKIE, `${state}.${nonce}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OAUTH_TTL_SECONDS,
  });

  const url = buildAuthUrl({
    redirectUri: getRedirectUri(request.url),
    state,
    nonce,
  });

  return Response.redirect(url, 302);
}
