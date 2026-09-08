import { cache } from "react";
// import { getDb } from "@/lib/mongodb";
import { getDb } from "@/lib/mongodb";
import {
  isR2Configured,
  placeholderUrlForGender,
  publicUrlForKey,
} from "@/lib/r2";
import type { CouncilMember, CouncilMemberPublic } from "@/lib/types";

const COLLECTION = "councilMembers";

/** Same-key renames after replacing a portrait (e.g. jpg → png on R2). */
const IMAGE_KEY_ALIASES: Record<string, string> = {
  "images/the-college/president-and-council-26-27/Dr Geethika Perera.jpg":
    "images/the-college/president-and-council-26-27/Dr Geethika Perera.png",
};

type CouncilMemberDoc = Omit<CouncilMember, "_id"> & {
  _id: import("mongodb").ObjectId;
};

function toPublic(doc: CouncilMemberDoc): CouncilMemberPublic {
  const { _id, imageKey, gender, ...rest } = doc;
  const placeholderUrl = placeholderUrlForGender(gender);
  const resolvedKey = imageKey
    ? (IMAGE_KEY_ALIASES[imageKey] ?? imageKey)
    : undefined;
  const imageUrl =
    resolvedKey && isR2Configured() ? publicUrlForKey(resolvedKey) : null;

  return {
    id: _id.toString(),
    gender,
    ...rest,
    imageUrl,
    placeholderUrl,
  };
}

/** Current council members for the given term, ordered by displayOrder. */
export const getCouncilMembers = cache(
  async (term = "2026-2027"): Promise<CouncilMemberPublic[]> => {
    const db = await getDb();
    const docs = await db
      .collection<CouncilMemberDoc>(COLLECTION)
      .find({ term })
      .sort({ displayOrder: 1 })
      .toArray();
    return docs.map(toPublic);
  }
);

// export async function getCouncilMembers(
//   term = "2026-2027"
// ): Promise<CouncilMemberPublic[]> {
//   const db = await getDb();
//   const docs = await db
//     .collection<CouncilMemberDoc>(COLLECTION)
//     .find({ term })
//     .sort({ displayOrder: 1 })
//     .toArray();
//   return docs.map(toPublic);
// }