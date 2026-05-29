import { clearMemberCookie, getMemberSession } from "@/lib/auth";

// Reads/writes per-request cookies — never prerender.
export const dynamic = "force-dynamic";

/** Return the current member session, or null if not signed in. */
export async function GET() {
  const session = await getMemberSession();
  return Response.json({ member: session });
}

/** Sign the member out by clearing their session cookie. */
export async function DELETE() {
  await clearMemberCookie();
  return Response.json({ ok: true });
}
