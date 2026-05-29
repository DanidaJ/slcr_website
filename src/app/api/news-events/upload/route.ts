import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  buildNewsEventImageKey,
  createUploadUrl,
  isR2Configured,
  publicUrlForKey,
} from "@/lib/r2";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Admin — presigned PUT URL for a news/event thumbnail image. */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isR2Configured()) {
    return Response.json(
      { error: "R2 storage is not configured. Add R2_* env vars." },
      { status: 503 }
    );
  }

  let filename = "";
  let contentType = "image/jpeg";
  try {
    const body = await request.json();
    filename = body.filename ?? "";
    contentType = body.contentType ?? "image/jpeg";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!filename) {
    return Response.json({ error: "filename is required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(contentType)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    );
  }

  const key = buildNewsEventImageKey(filename);
  const uploadUrl = await createUploadUrl(key, contentType);

  return Response.json({
    uploadUrl,
    key,
    publicUrl: publicUrlForKey(key),
  });
}
