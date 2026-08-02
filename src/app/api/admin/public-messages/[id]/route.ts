import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import {
  isValidMessageAction,
  mongoUpdateForAction,
  type MessageAction,
} from "@/lib/message-query";

export const dynamic = "force-dynamic";

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

/** Admin — mark read / unread / archive / unarchive one public message. */
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
    .collection("public_messages")
    .updateOne({ _id: new ObjectId(id) }, mongoUpdateForAction(actionOrErr));

  if (result.matchedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
