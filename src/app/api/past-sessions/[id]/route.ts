import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { deleteObject, isR2Configured } from "@/lib/r2";
import type { PastSessionAttachment } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "past_sessions";

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
