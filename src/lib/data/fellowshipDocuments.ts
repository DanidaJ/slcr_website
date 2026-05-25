import { getDb } from "@/lib/mongodb";
import type { FellowshipDocument } from "@/lib/types";

const COLLECTION = "fellowship_documents";

type FellowshipDoc = Omit<FellowshipDocument, "_id"> & {
  _id: import("mongodb").ObjectId;
};

function serialize(doc: FellowshipDoc): FellowshipDocument {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

export async function getFellowshipDocuments(): Promise<FellowshipDocument[]> {
  const db = await getDb();
  const docs = await db
    .collection<FellowshipDoc>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}
