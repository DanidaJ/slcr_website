import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { PublicMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Public — submit a contact form message. */
export async function POST(request: NextRequest) {
  let body: Partial<PublicMessage>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const subject = body.subject?.trim();
  const message = body.message?.trim();

  if (!name || !email || !subject || !message) {
    return Response.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const doc: Omit<PublicMessage, "_id"> = {
    name,
    email,
    subject,
    message,
    sentAt: new Date().toISOString(),
  };

  const db = await getDb();
  await db.collection("public_messages").insertOne(doc);

  return Response.json({ ok: true }, { status: 201 });
}
