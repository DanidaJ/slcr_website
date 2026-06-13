import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { Correspondence } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "correspondence";

/** Admin — list all member correspondence, newest first. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ sentAt: -1 })
    .toArray();

  const items: Correspondence[] = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...(rest as Omit<Correspondence, "_id">),
  }));

  const unread = items.filter((i) => !i.readAt).length;

  return Response.json({ items, unread });
}
