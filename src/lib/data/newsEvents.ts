import { getDb } from "@/lib/mongodb";
import type { NewsEvent } from "@/lib/types";

const COLLECTION = "news_events";

type NewsEventDoc = Omit<NewsEvent, "_id"> & { _id: import("mongodb").ObjectId };

function serialize(doc: NewsEventDoc): NewsEvent {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

/** Public read — newest first. */
export async function getNewsEvents(): Promise<NewsEvent[]> {
  const db = await getDb();
  const docs = await db
    .collection<NewsEventDoc>(COLLECTION)
    .find({})
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getNewsEventBySlug(
  slug: string
): Promise<NewsEvent | null> {
  const db = await getDb();
  const doc = await db
    .collection<NewsEventDoc>(COLLECTION)
    .findOne({ slug });
  return doc ? serialize(doc) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const db = await getDb();
  const doc = await db
    .collection(COLLECTION)
    .findOne({ slug }, { projection: { _id: 1 } });
  return Boolean(doc);
}

export async function getNewsEventSlugs(): Promise<string[]> {
  const db = await getDb();
  const docs = await db
    .collection<NewsEventDoc>(COLLECTION)
    .find({}, { projection: { slug: 1 } })
    .toArray();
  return docs.map((d) => d.slug);
}
