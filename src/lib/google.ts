/**
 * Minimal Google OpenID Connect (OAuth 2.0) helper — just enough for a
 * login-only flow. No external dependency: we drive Google's standard
 * endpoints directly and reuse our own signed session cookie afterwards.
 *
 * Flow:
 *   1. `buildAuthUrl()`  → redirect the user to Google's consent screen.
 *   2. Google redirects back to our callback with a `code`.
 *   3. `exchangeCode()`  → swap the code for tokens (server-to-server, TLS).
 *   4. `parseIdToken()`  → read the verified claims (email, name) from the
 *      id_token. Because the token is fetched directly from Google over TLS
 *      we trust its contents; we still validate iss / aud / exp / nonce.
 */

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const VALID_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

function getClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("Missing GOOGLE_CLIENT_ID environment variable.");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable.");
  }
  return secret;
}

/**
 * The callback URL Google redirects back to. Derived from the incoming
 * request origin so the same code works on localhost and in production —
 * just register both URIs in the Google Cloud console. An explicit
 * GOOGLE_REDIRECT_URI env var overrides this if set.
 */
export function getRedirectUri(requestUrl: string): string {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;
  const origin = new URL(requestUrl).origin;
  return `${origin}/api/auth/google/callback`;
}

/** Build the Google consent-screen URL to redirect the user to. */
export function buildAuthUrl(opts: {
  redirectUri: string;
  state: string;
  nonce: string;
}): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: opts.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: opts.state,
    nonce: opts.nonce,
    // Always show the account chooser so members can pick the right account.
    prompt: "select_account",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

type TokenResponse = { id_token?: string; error?: string; error_description?: string };

/** Exchange an authorization code for tokens (server-to-server). */
export async function exchangeCode(opts: {
  code: string;
  redirectUri: string;
}): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: opts.code,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      redirect_uri: opts.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || !data.id_token) {
    throw new Error(
      data.error_description || data.error || "Token exchange with Google failed."
    );
  }
  return data.id_token;
}

export type GoogleIdentity = {
  email: string;
  emailVerified: boolean;
  name?: string;
};

/**
 * Decode and validate the claims of a Google id_token. Throws if the token
 * is malformed or fails issuer / audience / expiry / nonce checks.
 */
export function parseIdToken(idToken: string, expectedNonce: string): GoogleIdentity {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Malformed id_token.");

  let claims: Record<string, unknown>;
  try {
    claims = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
  } catch {
    throw new Error("Could not decode id_token.");
  }

  if (typeof claims.iss !== "string" || !VALID_ISSUERS.includes(claims.iss)) {
    throw new Error("id_token has an unexpected issuer.");
  }
  if (claims.aud !== getClientId()) {
    throw new Error("id_token was not issued for this app.");
  }
  if (typeof claims.exp !== "number" || Date.now() >= claims.exp * 1000) {
    throw new Error("id_token has expired.");
  }
  if (claims.nonce !== expectedNonce) {
    throw new Error("id_token nonce mismatch.");
  }
  if (typeof claims.email !== "string") {
    throw new Error("id_token is missing an email.");
  }

  return {
    email: claims.email.toLowerCase(),
    emailVerified: claims.email_verified === true,
    name: typeof claims.name === "string" ? claims.name : undefined,
  };
}
