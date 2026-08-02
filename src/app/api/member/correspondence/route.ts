import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireMember } from "@/lib/auth";
import { notifyCorrespondenceCreated } from "@/lib/email";
import type { Correspondence } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "correspondence";

/** Member — send a message (+ optional file) to the admin team. */
export async function POST(request: NextRequest) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  let body: {
    subject?: string;
    message?: string;
    fileUrl?: string;
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileContentType?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const message = body.message?.trim();
  const fileUrl = body.fileUrl?.trim();

  if (!subject) {
    return Response.json({ error: "subject is required" }, { status: 400 });
  }
  if (!message && !fileUrl) {
    return Response.json(
      { error: "Provide a message, a file, or both" },
      { status: 400 }
    );
  }

  const db = await getDb();

  // Fetch the member's latest name + email from the DB (session may be stale).
  const memberDoc = await db
    .collection("members")
    .findOne(
      { email: session.email },
      { projection: { name: 1, email: 1 } }
    );

  const doc: Omit<Correspondence, "_id"> = {
    memberId: session.memberId,
    memberName: (memberDoc?.name as string) ?? session.name ?? session.email,
    memberEmail: session.email,
    subject,
    body: message || undefined,
    fileUrl: fileUrl || undefined,
    fileKey: body.fileKey?.trim() || undefined,
    fileName: body.fileName?.trim() || undefined,
    fileSize:
      typeof body.fileSize === "number" && body.fileSize >= 0
        ? body.fileSize
        : undefined,
    fileContentType: body.fileContentType?.trim() || undefined,
    sentAt: new Date().toISOString(),
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  const id = result.insertedId.toString();

  // Best-effort email to ADMIN_NOTIFY_EMAIL — never fail the request on email problems.
  const notifyTo = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  if (notifyTo) {
    await notifyCorrespondenceCreated(notifyTo, {
      id,
      memberName: doc.memberName,
      memberEmail: doc.memberEmail,
      subject: doc.subject,
      body: doc.body,
      hasFile: Boolean(doc.fileUrl),
    });
  }

  return Response.json(
    { ok: true, item: { _id: id, ...doc } },
    { status: 201 }
  );
}

/** Member — list their own sent correspondence. */
export async function GET() {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ memberId: session.memberId })
    .sort({ sentAt: -1 })
    .toArray();

  const items = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...(rest as Omit<Correspondence, "_id">),
  }));

  return Response.json({ items });
}
