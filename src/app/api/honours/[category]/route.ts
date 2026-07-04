import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { getHonourConfig } from "@/lib/honours";

export const dynamic = "force-dynamic";

/** Public — list every record in an honours collection, newest year first. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const config = getHonourConfig(category);
  if (!config) {
    return Response.json({ error: "Unknown category" }, { status: 404 });
  }

  const db = await getDb();
  const docs = await db
    .collection(config.collection)
    .find({})
    .sort({ year: -1, name: 1 })
    .toArray();

  const records = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ records });
}

/** Admin — add a new record to an honours collection. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { category } = await params;
  const config = getHonourConfig(category);
  if (!config) {
    return Response.json({ error: "Unknown category" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const doc: Record<string, string> = { createdAt: new Date().toISOString() };
  for (const col of config.columns) {
    const value = String(body[col.key] ?? "").trim();
    if (!value) {
      return Response.json(
        { error: `${col.label} is required` },
        { status: 400 }
      );
    }
    doc[col.key] = value;
  }

  const db = await getDb();
  const result = await db.collection(config.collection).insertOne(doc);

  return Response.json(
    { record: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
