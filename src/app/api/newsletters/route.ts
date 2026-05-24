import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { Newsletter } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "newsletters";

/** Public — list all newsletters, newest first. */
export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();

  const newsletters = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ newsletters });
}

/** Admin — create a newsletter record (the PDF is already uploaded to R2). */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: Partial<Newsletter>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, pdfUrl, year } = body;
  if (!title || !pdfUrl || !year) {
    return Response.json(
      { error: "title, pdfUrl and year are required" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const doc: Omit<Newsletter, "_id"> = {
    title: title.trim(),
    year: Number(year),
    volume: body.volume ? Number(body.volume) : undefined,
    issue: body.issue ? Number(body.issue) : undefined,
    month: body.month?.trim() || undefined,
    pdfUrl,
    pdfKey: body.pdfKey,
    publishedAt: body.publishedAt || now,
    createdAt: now,
  };

  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne(doc);

  return Response.json(
    { newsletter: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
