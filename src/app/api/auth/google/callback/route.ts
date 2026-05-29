import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { setMemberCookie } from "@/lib/auth";
import { exchangeCode, getRedirectUri, parseIdToken } from "@/lib/google";

export const dynamic = "force-dynamic";

const OAUTH_COOKIE = "slcr_oauth";
const LOGIN_PATH = "/membership/member-login";
const SUCCESS_PATH = "/?loggedIn=1";

/** Redirect back to the login page with an error code in the query string. */
function fail(request: NextRequest, code: string): Response {
  const url = new URL(LOGIN_PATH, request.url);
  url.searchParams.set("error", code);
  return Response.redirect(url, 302);
}

/** Google redirects here after consent. Verify, gate, and start a session. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  // Google reports its own errors (e.g. the user cancelled consent).
  if (params.get("error")) return fail(request, "google");

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) return fail(request, "invalid");

  // Validate the CSRF state against the cookie we set at login.
  const store = await cookies();
  const cookieValue = store.get(OAUTH_COOKIE)?.value;
  store.delete(OAUTH_COOKIE);
  if (!cookieValue) return fail(request, "expired");

  const [expectedState, nonce] = cookieValue.split(".");
  if (!expectedState || expectedState !== state) return fail(request, "state");

  // Exchange the code and read the verified identity.
  let email: string;
  let emailVerified: boolean;
  try {
    const idToken = await exchangeCode({
      code,
      redirectUri: getRedirectUri(request.url),
    });
    ({ email, emailVerified } = parseIdToken(idToken, nonce));
  } catch (err) {
    console.error("Google OIDC callback failed:", err);
    return fail(request, "google");
  }

  if (!emailVerified) return fail(request, "unverified");

  // Gate: the email must match an admin-created, active member.
  const db = await getDb();
  const member = await db
    .collection("members")
    .findOne({ email, status: "active" });

  if (!member) return fail(request, "unauthorized");

  await setMemberCookie({
    memberId: member._id.toString(),
    email: member.email,
    name: member.name,
    role: member.role === "admin" ? "admin" : "member",
  });

  // Best-effort: record the login time (don't block sign-in if it fails).
  await db
    .collection("members")
    .updateOne(
      { _id: member._id },
      { $set: { lastLoginAt: new Date().toISOString() } }
    )
    .catch((err) => console.error("Failed to record member login:", err));

  return Response.redirect(new URL(SUCCESS_PATH, request.url), 302);
}
