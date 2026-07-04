import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { getHonourConfig } from "@/lib/honours";

export const dynamic = "force-dynamic";

/** Admin — remove a record from an honours collection. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { category, id } = await params;
  const config = getHonourConfig(category);
  if (!config) {
    return Response.json({ error: "Unknown category" }, { status: 404 });
  }
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection(config.collection)
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
