import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

const COLLECTION = "member_inbox";

/**
 * Member — mark one of their own inbox items as read. The query is scoped to
 * the caller's memberId so a member can only ever touch their own items.
 */
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id), memberId: session.memberId },
    { $set: { readAt: new Date().toISOString() } }
  );

  if (result.matchedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
