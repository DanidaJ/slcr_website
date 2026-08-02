import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { Correspondence } from "@/lib/types";
import {
  isValidMessageAction,
  mongoUpdateForAction,
  type MessageAction,
} from "@/lib/message-query";

export const dynamic = "force-dynamic";

const COLLECTION = "correspondence";

async function parseAction(req: NextRequest): Promise<MessageAction | Response> {
  try {
    const body = await req.json();
    if (body?.action == null) return "read";
    if (!isValidMessageAction(body.action)) {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }
    return body.action;
  } catch {
    return "read";
  }
}

/** Admin — fetch a single correspondence item. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { _id, ...rest } = doc;
  const item: Correspondence = {
    _id: _id.toString(),
    ...(rest as Omit<Correspondence, "_id">),
  };
  return Response.json({ item });
}

/** Admin — mark read / unread / archive / unarchive one item. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const actionOrErr = await parseAction(req);
  if (actionOrErr instanceof Response) return actionOrErr;

  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, mongoUpdateForAction(actionOrErr));

  if (result.matchedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
