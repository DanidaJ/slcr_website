import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireMember } from "@/lib/auth";
import {
  isValidMessageAction,
  mongoUpdateForAction,
  type MessageAction,
} from "@/lib/message-query";

export const dynamic = "force-dynamic";

const COLLECTION = "member_inbox";

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

/**
 * Member — mark one of their own inbox items read / unread / archive / unarchive.
 * Scoped to the caller's memberId.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const actionOrErr = await parseAction(req);
  if (actionOrErr instanceof Response) return actionOrErr;

  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id), memberId: session.memberId },
    mongoUpdateForAction(actionOrErr)
  );

  if (result.matchedCount === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
