import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
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

const COLLECTION = "public_messages";
const SEARCH_FIELDS = ["name", "email", "subject", "message"];

/** Admin — list public contact messages with pagination, filters, and search. */
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { page, pageSize, status, q, view } = parseMessageListParams(req.nextUrl);
  const filter = buildListFilter(status, q, SEARCH_FIELDS, view);

  const db = await getDb();
  const collection = db.collection(COLLECTION);

  const [docs, total, unread, archivedCount] = await Promise.all([
    collection
      .find(filter)
      .sort({ sentAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    collection.countDocuments(filter),
    collection.countDocuments(activeUnreadFilter()),
    collection.countDocuments(archiveFilter("archived")),
  ]);

  const messages = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return Response.json({
    messages,
    unread,
    archivedCount,
    total,
    page,
    pageSize,
    totalPages,
    view,
  });
}

/** Admin — bulk read / unread / archive / unarchive. */
export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

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
    { _id: { $in: ids.map((id) => new ObjectId(id)) } },
    mongoUpdateForAction(action)
  );

  return Response.json({ ok: true, modified: result.modifiedCount });
}
