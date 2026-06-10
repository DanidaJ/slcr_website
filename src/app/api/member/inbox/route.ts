import { getDb } from "@/lib/mongodb";
import { requireMember } from "@/lib/auth";
import type { InboxItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "member_inbox";

/** Member — list the signed-in member's inbox items, newest first. */
export async function GET() {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ memberId: session.memberId })
    .sort({ sentAt: -1 })
    .toArray();

  const items: InboxItem[] = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...(rest as Omit<InboxItem, "_id">),
  }));

  const unread = items.filter((i) => !i.readAt).length;

  return Response.json({ items, unread });
}
