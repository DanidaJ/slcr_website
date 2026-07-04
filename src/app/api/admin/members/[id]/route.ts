import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const COLLECTION = "members";

/** Admin — update a member's status ("active" | "suspended"). */
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

  let body: { status?: string; memberNumber?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.status !== "active" && body.status !== "suspended") {
    return Response.json(
      { error: "status must be 'active' or 'suspended'" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const existing = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const memberNumber = body.memberNumber?.trim();

  // Approving a pending application requires a membership number — the admin
  // must assign one before the member can sign in.
  const isApproval = existing.status === "pending" && body.status === "active";
  if (isApproval && !memberNumber && !existing.memberNumber) {
    return Response.json(
      { error: "A membership number is required to approve a member." },
      { status: 400 }
    );
  }

  const update: Record<string, unknown> = { status: body.status };
  if (memberNumber) update.memberNumber = memberNumber;

  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  return Response.json({ ok: true });
}

/** Admin — remove a member account entirely (revokes access). */
export async function DELETE(
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
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
