import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin, getMemberSession } from "@/lib/auth";
import { notifyDirectMessage } from "@/lib/email";
import type { InboxItem } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Admin — send a direct message to a single member. May carry text, a file, or
 * both (file metadata comes from a prior upload to /api/admin/messages/upload).
 * Creates one `member_inbox` document and emails the recipient (best-effort).
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: {
    memberId?: string;
    subject?: string;
    message?: string;
    fileUrl?: string;
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileContentType?: string;
    isCertificate?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const memberId = body.memberId?.trim();
  const subject = body.subject?.trim();
  const message = body.message?.trim();
  const fileUrl = body.fileUrl?.trim();

  if (!memberId || !ObjectId.isValid(memberId)) {
    return Response.json({ error: "A valid memberId is required" }, { status: 400 });
  }
  if (!subject) {
    return Response.json({ error: "subject is required" }, { status: 400 });
  }
  // Must carry at least a message or a file — an empty item is meaningless.
  if (!message && !fileUrl) {
    return Response.json(
      { error: "Provide a message, a file, or both" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const member = await db
    .collection("members")
    .findOne({ _id: new ObjectId(memberId) }, { projection: { email: 1 } });
  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  const sentBy = (await getMemberSession())?.email ?? "admin";

  const doc: Omit<InboxItem, "_id"> = {
    memberId,
    type: "message",
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
    isCertificate: body.isCertificate === true,
    sentAt: new Date().toISOString(),
    sentBy,
  };
  const result = await db.collection("member_inbox").insertOne(doc);

  await notifyDirectMessage(member.email as string, subject, Boolean(fileUrl));

  return Response.json(
    { ok: true, item: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
