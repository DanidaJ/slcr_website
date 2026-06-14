import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { deleteObject, isR2Configured } from "@/lib/r2";

export const dynamic = "force-dynamic";

const COLLECTION = "news_events";

function parseBody(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Admin — update an existing news/event post. */
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

  let body: {
    title?: string;
    excerpt?: string;
    bodyText?: string;
    publishedAt?: string;
    imageUrl?: string;
    imageKey?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = body.title?.trim();
  const excerpt = body.excerpt?.trim();
  if (!title || !excerpt) {
    return Response.json(
      { error: "title and excerpt are required" },
      { status: 400 }
    );
  }

  const bodyParagraphs = body.bodyText ? parseBody(body.bodyText) : [excerpt];

  const update: Record<string, unknown> = {
    title,
    excerpt,
    body: bodyParagraphs,
    ...(body.publishedAt ? { publishedAt: body.publishedAt } : {}),
    ...(body.imageUrl ? { imageUrl: body.imageUrl, imageKey: body.imageKey } : {}),
  };

  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  if (result.matchedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}

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

  if (doc.imageKey && isR2Configured()) {
    try {
      await deleteObject(doc.imageKey);
    } catch (err) {
      console.error("Failed to delete R2 object:", err);
    }
  }

  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return Response.json({ ok: true });
}
