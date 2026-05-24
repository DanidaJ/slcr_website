import type { NextRequest } from "next/server";
import {
  checkAdminPassword,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";

// Auth depends on per-request cookies — never prerender.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let password = "";
  try {
    ({ password = "" } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!password || !checkAdminPassword(password)) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  await setSessionCookie();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearSessionCookie();
  return Response.json({ ok: true });
}
