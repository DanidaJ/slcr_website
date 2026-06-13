import type { NextRequest } from "next/server";
import { requireMember } from "@/lib/auth";
import {
  buildCorrespondenceKey,
  createUploadUrl,
  isR2Configured,
  publicUrlForKey,
} from "@/lib/r2";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

/**
 * Member — return a presigned PUT URL so the browser can upload a file
 * straight to R2 before submitting their correspondence message.
 */
export async function POST(request: NextRequest) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  if (!isR2Configured()) {
    return Response.json(
      { error: "R2 storage is not configured." },
      { status: 503 }
    );
  }

  let filename = "";
  let contentType = "";
  try {
    const body = await request.json();
    filename = body.filename ?? "";
    contentType = body.contentType ?? "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!filename) {
    return Response.json({ error: "filename is required" }, { status: 400 });
  }
  if (!ALLOWED.has(contentType)) {
    return Response.json(
      { error: "Only PDF, PNG, JPEG, or WebP files are allowed" },
      { status: 400 }
    );
  }

  const key = buildCorrespondenceKey(session.memberId, filename);
  const uploadUrl = await createUploadUrl(key, contentType);

  return Response.json({ uploadUrl, key, publicUrl: publicUrlForKey(key) });
}
