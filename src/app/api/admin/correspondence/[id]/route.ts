import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { Correspondence } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "correspondence";

/** Admin — fetch a single correspondence item. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { _id, ...rest } = doc;
  const item: Correspondence = {
    _id: _id.toString(),
    ...(rest as Omit<Correspondence, "_id">),
  };
  return Response.json({ item });
}

/** Admin — mark a correspondence item as read. */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .updateOne(
      { _id: new ObjectId(id), readAt: { $exists: false } },
      { $set: { readAt: new Date().toISOString() } }
    );

  if (result.matchedCount === 0) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: true });
}
