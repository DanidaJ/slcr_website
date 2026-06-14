import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Admin — list all public contact messages, newest first. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  const docs = await db
    .collection("public_messages")
    .find({})
    .sort({ sentAt: -1 })
    .toArray();

  const messages = docs.map(({ _id, ...rest }) => ({
    _id: _id.toString(),
    ...rest,
  }));

  return Response.json({ messages });
}
