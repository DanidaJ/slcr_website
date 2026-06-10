import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin, getMemberSession } from "@/lib/auth";
import { notifyBroadcast } from "@/lib/email";
import type { Broadcast, InboxItem, Member } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Admin — send a text-only announcement to every active member. We fan the
 * broadcast out into one `member_inbox` document per member (so the member's
 * inbox query stays trivial), keep a record in `broadcasts` for history, then
 * fire best-effort email notifications.
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: { subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const message = body.message?.trim();
  if (!subject || !message) {
    return Response.json(
      { error: "subject and message are required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const members = (await db
    .collection("members")
    .find({ status: "active" })
    .project({ _id: 1, email: 1, name: 1 })
    .toArray()) as Pick<Member, "_id" | "email" | "name">[];

  if (members.length === 0) {
    return Response.json({ error: "No active members to send to" }, { status: 400 });
  }

  const sentAt = new Date().toISOString();
  const sentBy = (await getMemberSession())?.email ?? "admin";

  const inboxDocs: Omit<InboxItem, "_id">[] = members.map((m) => ({
    memberId: m._id!.toString(),
    type: "broadcast",
    subject,
    body: message,
    sentAt,
    sentBy,
  }));
  await db.collection("member_inbox").insertMany(inboxDocs);

  const broadcast: Omit<Broadcast, "_id"> = {
    subject,
    body: message,
    recipientCount: members.length,
    sentAt,
    sentBy,
  };
  await db.collection("broadcasts").insertOne(broadcast);

  // Best-effort emails — never block or fail the request on email problems.
  await Promise.allSettled(
    members.map((m) => notifyBroadcast(m.email, subject, message))
  );

  return Response.json(
    { ok: true, recipientCount: members.length },
    { status: 201 }
  );
}

/** Admin — list past broadcasts, newest first (send history). */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  const docs = await db
    .collection("broadcasts")
    .find({})
    .sort({ sentAt: -1 })
    .limit(50)
    .toArray();

  const broadcasts = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ broadcasts });
}
