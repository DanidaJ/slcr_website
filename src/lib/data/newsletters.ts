import { getDb } from "@/lib/mongodb";
import type { Newsletter } from "@/lib/types";

const COLLECTION = "newsletters";

type NewsletterDoc = Omit<Newsletter, "_id"> & { _id: import("mongodb").ObjectId };

function serialize(doc: NewsletterDoc): Newsletter {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

/** Public read — newest first. Not cached so admin changes show immediately. */
export async function getNewsletters(): Promise<Newsletter[]> {
  const db = await getDb();
  const docs = await db
    .collection<NewsletterDoc>(COLLECTION)
    .find({})
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}
