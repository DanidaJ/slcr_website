import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { deleteObject, isR2Configured } from "@/lib/r2";
import type { PastSessionAttachment } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "past_sessions";

function normalizeAttachments(
  attachments: PastSessionAttachment[]
): PastSessionAttachment[] {
  return attachments
    .map((item) => ({
      url: String(item.url ?? "").trim(),
      key: item.key?.trim() || undefined,
      filename: item.filename?.trim() || undefined,
    }))
    .filter((item) => item.url);
}

/** Admin — update a past session. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: {
    title?: string;
    description?: string;
    attachments?: PastSessionAttachment[];
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = body.title?.trim();
  const description = body.description?.trim();
  if (!title || !description) {
    return Response.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.attachments)) {
    return Response.json(
      { error: "attachments are required" },
      { status: 400 }
    );
  }

  const attachments = normalizeAttachments(body.attachments);
  if (attachments.length === 0) {
    return Response.json(
      { error: "At least one image attachment is required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const doc = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const previous = normalizeAttachments(
    (doc.attachments ?? []) as PastSessionAttachment[]
  );
  const removed = previous.filter(
    (prev) =>
      prev.key &&
      !attachments.some((next) => next.key === prev.key || next.url === prev.url)
  );

  if (isR2Configured()) {
    for (const attachment of removed) {
      if (!attachment.key) continue;
      try {
        await deleteObject(attachment.key);
      } catch (err) {
        console.error("Failed to delete R2 object:", err);
      }
    }
  }

  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, description, attachments } }
  );

  if (result.matchedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}

/** Admin — delete a past session and its R2 attachments (if any). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const doc = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const attachments = (doc.attachments ?? []) as PastSessionAttachment[];
  if (isR2Configured()) {
    for (const attachment of attachments) {
      if (!attachment.key) continue;
      try {
        await deleteObject(attachment.key);
      } catch (err) {
        console.error("Failed to delete R2 object:", err);
      }
    }
  }

  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return Response.json({ ok: true });
}
