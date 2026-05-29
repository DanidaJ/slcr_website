import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { slugExists } from "@/lib/data/newsEvents";
import { uniqueSlug } from "@/lib/slug";
import type { NewsEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "news_events";

function parseBody(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Public — list all news & events, newest first. */
export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();

  const newsEvents = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ newsEvents });
}

/** Admin — create a news/event post (image already uploaded to R2 if provided). */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: Partial<NewsEvent> & { bodyText?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, excerpt, imageUrl } = body;
  if (!title?.trim() || !excerpt?.trim() || !imageUrl?.trim()) {
    return Response.json(
      { error: "title, excerpt, and imageUrl are required" },
      { status: 400 }
    );
  }

  const bodyParagraphs =
    Array.isArray(body.body) && body.body.length > 0
      ? body.body.map((p) => String(p).trim()).filter(Boolean)
      : body.bodyText
        ? parseBody(body.bodyText)
        : [excerpt.trim()];

  const now = new Date().toISOString();
  const publishedAt = body.publishedAt || now;

  const slug = body.slug?.trim()
    ? await uniqueSlug(body.slug.trim(), slugExists)
    : await uniqueSlug(title.trim(), slugExists);

  const doc: Omit<NewsEvent, "_id"> = {
    slug,
    title: title.trim(),
    excerpt: excerpt.trim(),
    body: bodyParagraphs,
    imageUrl: imageUrl.trim(),
    imageKey: body.imageKey,
    publishedAt,
    createdAt: now,
  };

  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne(doc);

  return Response.json(
    { newsEvent: { _id: result.insertedId.toString(), ...doc } },
    { status: 201 }
  );
}
