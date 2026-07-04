import { getDb } from "@/lib/mongodb";
import { isHomeAnnouncementActive } from "@/lib/homeAnnouncement";
import type { HomeAnnouncement } from "@/lib/types";

const COLLECTION = "home_announcements";
export const HERO_AAS_PLACEMENT = "hero-aas-2026" as const;

type HomeAnnouncementDoc = Omit<HomeAnnouncement, "_id"> & {
  _id: import("mongodb").ObjectId;
};

function serialize(doc: HomeAnnouncementDoc): HomeAnnouncement {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

/** Active hero message for the home page, or null if none / expired. */
export async function getActiveHomeAnnouncement(): Promise<HomeAnnouncement | null> {
  const db = await getDb();
  const doc = await db
    .collection<HomeAnnouncementDoc>(COLLECTION)
    .findOne({ placement: HERO_AAS_PLACEMENT });

  if (!doc || !isHomeAnnouncementActive(doc.expiresAt)) return null;
  return serialize(doc);
}

/** Admin read — returns the stored message even when expired. */
export async function getHomeAnnouncementForAdmin(): Promise<HomeAnnouncement | null> {
  const db = await getDb();
  const doc = await db
    .collection<HomeAnnouncementDoc>(COLLECTION)
    .findOne({ placement: HERO_AAS_PLACEMENT });

  return doc ? serialize(doc) : null;
}
