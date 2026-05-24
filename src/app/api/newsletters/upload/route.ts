import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  buildNewsletterKey,
  createUploadUrl,
  isR2Configured,
  publicUrlForKey,
} from "@/lib/r2";

export const dynamic = "force-dynamic";

/**
 * Admin — returns a presigned PUT URL. The browser uploads the PDF straight
 * to R2 with it, then calls POST /api/newsletters with the returned publicUrl.
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

  let filename = "";
  let contentType = "application/pdf";
  try {
    const body = await request.json();
    filename = body.filename ?? "";
    contentType = body.contentType ?? "application/pdf";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!filename) {
    return Response.json({ error: "filename is required" }, { status: 400 });
  }
  if (contentType !== "application/pdf") {
    return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  const key = buildNewsletterKey(filename);
  const uploadUrl = await createUploadUrl(key, contentType);

  return Response.json({
    uploadUrl,
    key,
    publicUrl: publicUrlForKey(key),
  });
}
