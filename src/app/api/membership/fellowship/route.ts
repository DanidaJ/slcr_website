import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { FellowshipDocument } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "fellowship_documents";

export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const documents = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ documents });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: Partial<FellowshipDocument>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, pdfUrl } = body;
  if (!title || !pdfUrl) {
    return Response.json(
      { error: "title and pdfUrl are required" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const doc: Omit<FellowshipDocument, "_id"> = {
    title: title.trim(),
    description: body.description?.trim() || undefined,
    pdfUrl,
    pdfKey: body.pdfKey,
    createdAt: now,
  };

  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne(doc);

  return Response.json(
    { document: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
