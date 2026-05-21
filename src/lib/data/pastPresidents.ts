import { cache } from "react";
import { getDb } from "@/lib/mongodb";
import type { PastPresident } from "@/lib/types";

const COLLECTION = "pastPresidents";

export const getPastPresidents = cache(async (): Promise<PastPresident[]> => {
  const db = await getDb();
  return db
    .collection<PastPresident>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();
});
