import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { PastSession, PastSessionAttachment } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "past_sessions";

/** Public — list all past sessions, newest first. */
export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();

  const pastSessions = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ pastSessions });
}

/** Admin — create a past session (images already uploaded to R2). */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: Partial<PastSession>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, description, attachments } = body;
  if (!title?.trim() || !description?.trim()) {
    return Response.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(attachments) || attachments.length === 0) {
    return Response.json(
      { error: "At least one image attachment is required" },
      { status: 400 }
    );
  }

  const normalizedAttachments: PastSessionAttachment[] = attachments
    .map((item) => ({
      url: String(item.url ?? "").trim(),
      key: item.key?.trim() || undefined,
      filename: item.filename?.trim() || undefined,
    }))
    .filter((item) => item.url);

  if (normalizedAttachments.length === 0) {
    return Response.json(
      { error: "At least one valid image attachment is required" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const doc: Omit<PastSession, "_id"> = {
    title: title.trim(),
    description: description.trim(),
    attachments: normalizedAttachments,
    publishedAt: body.publishedAt || now,
    createdAt: now,
  };

  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne(doc);

  return Response.json(
    { pastSession: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
