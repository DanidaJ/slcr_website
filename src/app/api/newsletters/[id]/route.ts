import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { deleteObject, isR2Configured } from "@/lib/r2";

export const dynamic = "force-dynamic";

const COLLECTION = "newsletters";

/** Admin — delete a newsletter record and its R2 object (if any). */
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

  // Remove the file from R2 first (only files we uploaded carry a pdfKey).
  if (doc.pdfKey && isR2Configured()) {
    try {
      await deleteObject(doc.pdfKey);
    } catch (err) {
      console.error("Failed to delete R2 object:", err);
      // Continue — we still remove the DB record so it disappears from the site.
    }
  }

  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return Response.json({ ok: true });
}
