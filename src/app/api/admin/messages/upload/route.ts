import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import {
  buildMemberFileKey,
  createUploadUrl,
  isR2Configured,
  publicUrlForKey,
} from "@/lib/r2";

export const dynamic = "force-dynamic";

/** File types an admin may send to a member (certificates, letters, images). */
const ALLOWED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

/**
 * Admin — return a presigned PUT URL so the browser uploads the file straight
 * to R2, scoped under member-files/{memberId}/. The browser then posts the
 * returned publicUrl/key to /api/admin/messages.
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isR2Configured()) {
    return Response.json(
      { error: "R2 storage is not configured. Add R2_* env vars." },
      { status: 503 }
    );
  }

  let memberId = "";
  let filename = "";
  let contentType = "";
  try {
    const body = await request.json();
    memberId = body.memberId ?? "";
    filename = body.filename ?? "";
    contentType = body.contentType ?? "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!memberId || !ObjectId.isValid(memberId)) {
    return Response.json({ error: "A valid memberId is required" }, { status: 400 });
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

  const key = buildMemberFileKey(memberId, filename);
  const uploadUrl = await createUploadUrl(key, contentType);

  return Response.json({ uploadUrl, key, publicUrl: publicUrlForKey(key) });
}
