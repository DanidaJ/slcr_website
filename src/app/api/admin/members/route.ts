import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { Member } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "members";

/** Admin — list all member accounts, newest first. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const members = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ members });
}

/** Admin — create (authorize) a member account by email. */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: Partial<Member>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  if (!email || !name) {
    return Response.json(
      { error: "name and email are required" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const db = await getDb();

  // Email is the login identity — it must be unique.
  const existing = await db.collection(COLLECTION).findOne({ email });
  if (existing) {
    return Response.json(
      { error: "A member with this email already exists" },
      { status: 409 }
    );
  }

  const doc: Omit<Member, "_id"> = {
    email,
    name,
    memberNumber: body.memberNumber?.trim() || undefined,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  const result = await db.collection(COLLECTION).insertOne(doc);

  return Response.json(
    { member: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
