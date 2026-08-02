import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireMember } from "@/lib/auth";
import type { InboxItem } from "@/lib/types";
import {
  activeUnreadFilter,
  archiveFilter,
  buildListFilter,
  isValidMessageAction,
  mongoUpdateForAction,
  parseMessageListParams,
  type MessageAction,
} from "@/lib/message-query";

export const dynamic = "force-dynamic";

const COLLECTION = "member_inbox";
const SEARCH_FIELDS = ["subject", "body", "fileName", "sentBy"];

type InboxTypeFilter = "all" | "announcements" | "messages" | "certificates";

function typeFilter(type: InboxTypeFilter): Record<string, unknown> | null {
  if (type === "announcements") return { type: "broadcast" };
  if (type === "certificates") return { isCertificate: true };
  if (type === "messages") {
    return { type: "message", isCertificate: { $ne: true } };
  }
  return null;
}

function parseType(url: URL): InboxTypeFilter {
  const t = url.searchParams.get("type") ?? "all";
  if (t === "announcements" || t === "messages" || t === "certificates") {
    return t;
  }
  return "all";
}

/** Member — list inbox with pagination, search, type/status filters, archive view. */
export async function GET(req: NextRequest) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const { page, pageSize, status, q, view } = parseMessageListParams(req.nextUrl);
  const type = parseType(req.nextUrl);

  const scope: Record<string, unknown> = { memberId: session.memberId };
  const tf = typeFilter(type);
  const extra = tf ? { ...scope, ...tf } : scope;
  const listFilter = buildListFilter(status, q, SEARCH_FIELDS, view, extra);

  const db = await getDb();
  const collection = db.collection(COLLECTION);
  const memberScope = { memberId: session.memberId };

  const [docs, total, unread, archivedCount] = await Promise.all([
    collection
      .find(listFilter)
      .sort({ sentAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    collection.countDocuments(listFilter),
    collection.countDocuments({ ...memberScope, ...activeUnreadFilter() }),
    collection.countDocuments({
      ...memberScope,
      ...archiveFilter("archived"),
    }),
  ]);

  const items: InboxItem[] = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...(rest as Omit<InboxItem, "_id">),
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return Response.json({
    items,
    unread,
    archivedCount,
    total,
    page,
    pageSize,
    totalPages,
    view,
  });
}

/** Member — bulk read / unread / archive / unarchive on own items. */
export async function PATCH(req: NextRequest) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  let body: { ids?: string[]; action?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidMessageAction(body.action)) {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }
  const action: MessageAction = body.action;

  const ids = (body.ids ?? []).filter((id) => ObjectId.isValid(id));
  if (ids.length === 0) {
    return Response.json({ error: "No valid ids provided" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection(COLLECTION).updateMany(
    {
      _id: { $in: ids.map((id) => new ObjectId(id)) },
      memberId: session.memberId,
    },
    mongoUpdateForAction(action)
  );

  return Response.json({ ok: true, modified: result.modifiedCount });
}
