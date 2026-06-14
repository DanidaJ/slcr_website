import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { setMemberCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

/** Member sign-in with email/username and password. */
export async function POST(request: NextRequest) {
  let username = "";
  let password = "";
  try {
    ({ username = "", password = "" } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const identifier = username.trim().toLowerCase();
  if (!identifier || !password) {
    return Response.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  const db = await getDb();
  const member = await db.collection("members").findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!member) {
    return Response.json(
      { error: "Invalid username or password.", code: "credentials" },
      { status: 401 }
    );
  }

  if (member.status === "pending") {
    return Response.json(
      {
        error:
          "Your application is still pending review. You will be able to sign in once an administrator approves your account.",
        code: "pending",
      },
      { status: 403 }
    );
  }

  if (member.status === "suspended") {
    return Response.json(
      {
        error: "Your account has been suspended. Please contact the College.",
        code: "suspended",
      },
      { status: 403 }
    );
  }

  if (typeof member.passwordHash !== "string" || !member.passwordHash) {
    return Response.json(
      {
        error:
          "No password is set for this account. Sign in with Google or contact the College.",
        code: "no_password",
      },
      { status: 401 }
    );
  }

  if (!verifyPassword(password, member.passwordHash)) {
    return Response.json(
      { error: "Invalid username or password.", code: "credentials" },
      { status: 401 }
    );
  }

  await setMemberCookie({
    memberId: member._id.toString(),
    email: member.email,
    name: member.name,
    memberNumber: member.memberNumber,
    role: member.role === "admin" ? "admin" : "member",
  });

  await db
    .collection("members")
    .updateOne(
      { _id: member._id },
      { $set: { lastLoginAt: new Date().toISOString() } }
    )
    .catch((err) => console.error("Failed to record member login:", err));

  return Response.json({ ok: true });
}
