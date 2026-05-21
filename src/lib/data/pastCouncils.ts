import { cache } from "react";
import { getDb } from "@/lib/mongodb";
import type { PastCouncil } from "@/lib/types";

const COLLECTION = "pastCouncils";

export const getPastCouncils = cache(async (): Promise<PastCouncil[]> => {
  const db = await getDb();
  return db
    .collection<PastCouncil>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ year: -1 })
    .toArray();
});
