import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getHomeAnnouncementForAdmin,
  HERO_AAS_PLACEMENT,
} from "@/lib/data/homeAnnouncement";
import { isHomeAnnouncementActive } from "@/lib/homeAnnouncement";
import { getDb } from "@/lib/mongodb";
import type { HomeAnnouncement } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "home_announcements";

/** Admin — read the current hero announcement (including expired). */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const announcement = await getHomeAnnouncementForAdmin();
  const active = announcement
    ? isHomeAnnouncementActive(announcement.expiresAt)
    : false;

  return Response.json({ announcement, active });
}

/** Admin — create or replace the hero announcement. */
export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: Partial<HomeAnnouncement>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = body.message?.trim();
  const expiresAt = body.expiresAt?.trim();

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }
  if (!expiresAt || !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
    return Response.json(
      { error: "expiresAt must be a date (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const db = await getDb();
  const existing = await db.collection(COLLECTION).findOne({
    placement: HERO_AAS_PLACEMENT,
  });

  const doc: Omit<HomeAnnouncement, "_id"> = {
    placement: HERO_AAS_PLACEMENT,
    message,
    expiresAt,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).updateOne(
    { placement: HERO_AAS_PLACEMENT },
    { $set: doc },
    { upsert: true }
  );

  const saved = await getHomeAnnouncementForAdmin();
  return Response.json({ announcement: saved });
}

/** Admin — remove the hero announcement. */
export async function DELETE() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ placement: HERO_AAS_PLACEMENT });
  return Response.json({ ok: true });
}
