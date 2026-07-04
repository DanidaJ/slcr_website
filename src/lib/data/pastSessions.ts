import { getDb } from "@/lib/mongodb";
import type { PastSession } from "@/lib/types";

const COLLECTION = "past_sessions";

type PastSessionDoc = Omit<PastSession, "_id"> & {
  _id: import("mongodb").ObjectId;
};

function serialize(doc: PastSessionDoc): PastSession {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

/** Public read — newest first. Not cached so admin changes show immediately. */
export async function getPastSessions(): Promise<PastSession[]> {
  const db = await getDb();
  const docs = await db
    .collection<PastSessionDoc>(COLLECTION)
    .find({})
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}
