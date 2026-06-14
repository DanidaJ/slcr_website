import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Admin — mark a public message as read. */
export async function PATCH(
  _request: NextRequest,
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
    .collection("public_messages")
    .updateOne(
      { _id: new ObjectId(id), readAt: { $exists: false } },
      { $set: { readAt: new Date().toISOString() } }
    );

  if (result.matchedCount === 0) {
    // Already read or not found — not an error from the UI's perspective.
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
