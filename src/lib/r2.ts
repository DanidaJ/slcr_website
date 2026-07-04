import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 is S3-compatible, so we use the AWS S3 SDK pointed at the
 * R2 endpoint. Credentials live in env vars (see .env.local).
 */

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_BASE_URL
  );
}

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function sanitize(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Build the object key for a newsletter PDF from a sanitized filename. */
export function buildNewsletterKey(filename: string): string {
  return `newsletters/${Date.now()}-${sanitize(filename)}`;
}

/** Build the object key for a fellowship document. */
export function buildFellowshipKey(filename: string): string {
  return `docs/${Date.now()}-${sanitize(filename)}`;
}

/** Build the object key for a file an admin sends to a specific member. */
export function buildMemberFileKey(memberId: string, filename: string): string {
  return `member-files/${memberId}/${Date.now()}-${sanitize(filename)}`;
}

/** Build the object key for a file a member sends to admin (correspondence). */
export function buildCorrespondenceKey(memberId: string, filename: string): string {
  return `correspondence/${memberId}/${Date.now()}-${sanitize(filename)}`;
}

/** Build the object key for a news & events thumbnail image. */
export function buildNewsEventImageKey(filename: string): string {
  return `news-events/${Date.now()}-${sanitize(filename)}`;
}

/** Gender-based profile placeholders stored in R2. */
export const PLACEHOLDER_IMAGE_KEYS = {
  male: "images/placeholders/Profile-Placeholder-male.png",
  female: "images/placeholders/Profile-Placeholder-female.png",
} as const;

/** Build the R2 key for a council member portrait (filename = display name). */
export function buildCouncilMemberImageKey(
  displayName: string,
  termSlug = "26-27"
): string {
  return `images/the-college/president-and-council-${termSlug}/${displayName}.jpg`;
}

/** The public URL a stored object will be served from. */
export function publicUrlForKey(key: string): string {
  const base = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "");
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/${encodedKey}`;
}

export function placeholderUrlForGender(
  gender: keyof typeof PLACEHOLDER_IMAGE_KEYS
): string {
  return publicUrlForKey(PLACEHOLDER_IMAGE_KEYS[gender]);
}

/**
 * Create a presigned PUT URL so the browser can upload the file directly to R2
 * without routing the bytes through our server.
 */
export async function createUploadUrl(
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getClient(), command, { expiresIn: 600 });
}

export async function deleteObject(key: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
  );
}
