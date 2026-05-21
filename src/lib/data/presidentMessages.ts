import { cache } from "react";
import { getDb } from "@/lib/mongodb";
import type { PresidentMessage } from "@/lib/types";

const COLLECTION = "presidentMessages";

async function collection() {
  const db = await getDb();
  return db.collection<PresidentMessage>(COLLECTION);
}

export const getCurrentPresidentMessage = cache(
  async (): Promise<PresidentMessage | null> => {
    const col = await collection();
    const doc = await col
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(1)
      .next();
    return doc ?? null;
  }
);

export const getPastPresidentMessages = cache(
  async (): Promise<PresidentMessage[]> => {
    const col = await collection();
    return col
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .skip(1)
      .toArray();
  }
);

export const getPastPresidentMessageBySlug = cache(
  async (slug: string): Promise<PresidentMessage | null> => {
    const col = await collection();
    const doc = await col.findOne({ slug }, { projection: { _id: 0 } });
    return doc ?? null;
  }
);

export const getPastPresidentMessageSlugs = cache(
  async (): Promise<string[]> => {
    const col = await collection();
    const docs = await col
      .find({}, { projection: { _id: 0, slug: 1 } })
      .sort({ createdAt: -1 })
      .skip(1)
      .toArray();
    return docs.map((d) => d.slug);
  }
);
