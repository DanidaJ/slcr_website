/** Shared list/query helpers for messaging (admin + member inbox). */

export type ReadFilter = "all" | "unread" | "read";
export type ArchiveView = "inbox" | "archived";
export type MessageAction = "read" | "unread" | "archive" | "unarchive";

export const DEFAULT_PAGE_SIZE = 50;
export const MESSAGE_ACTIONS: MessageAction[] = [
  "read",
  "unread",
  "archive",
  "unarchive",
];

export function parseMessageListParams(url: URL) {
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const rawLimit = Number.parseInt(
    url.searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE),
    10
  );
  const pageSize = Math.min(100, Math.max(1, rawLimit || DEFAULT_PAGE_SIZE));
  const statusParam = url.searchParams.get("status") ?? "all";
  const status: ReadFilter =
    statusParam === "unread" || statusParam === "read" ? statusParam : "all";
  const q = (url.searchParams.get("q") ?? "").trim();
  const view: ArchiveView =
    url.searchParams.get("view") === "archived" ? "archived" : "inbox";
  return { page, pageSize, status, q, view };
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Mongo filter for read/unread. Unread = `readAt` never set. */
export function readAtFilter(status: ReadFilter): Record<string, unknown> | null {
  if (status === "unread") return { readAt: { $exists: false } };
  if (status === "read") return { readAt: { $exists: true } };
  return null;
}

export function archiveFilter(view: ArchiveView): Record<string, unknown> {
  if (view === "archived") return { archivedAt: { $exists: true } };
  return { archivedAt: { $exists: false } };
}

/** Active (non-archived) unread messages — used for navbar badges. */
export function activeUnreadFilter(): Record<string, unknown> {
  return {
    readAt: { $exists: false },
    archivedAt: { $exists: false },
  };
}

export function textSearchFilter(
  q: string,
  fields: string[]
): Record<string, unknown> | null {
  if (!q) return null;
  const regex = { $regex: escapeRegex(q), $options: "i" };
  return { $or: fields.map((field) => ({ [field]: regex })) };
}

export function buildListFilter(
  status: ReadFilter,
  q: string,
  searchFields: string[],
  view: ArchiveView = "inbox",
  extra?: Record<string, unknown> | null
): Record<string, unknown> {
  const parts: Record<string, unknown>[] = [archiveFilter(view)];
  if (extra && Object.keys(extra).length > 0) parts.push(extra);
  const statusFilter = readAtFilter(status);
  if (statusFilter) parts.push(statusFilter);
  const searchFilter = textSearchFilter(q, searchFields);
  if (searchFilter) parts.push(searchFilter);
  if (parts.length === 1) return parts[0];
  return { $and: parts };
}

export function isValidMessageAction(value: unknown): value is MessageAction {
  return (
    typeof value === "string" &&
    (MESSAGE_ACTIONS as string[]).includes(value)
  );
}

/** Mongo update document for a single messaging action. */
export function mongoUpdateForAction(action: MessageAction) {
  const now = new Date().toISOString();
  switch (action) {
    case "read":
      return { $set: { readAt: now } };
    case "unread":
      return { $unset: { readAt: "" } };
    case "archive":
      return { $set: { archivedAt: now } };
    case "unarchive":
      return { $unset: { archivedAt: "" } };
  }
}

function fileBaseName(fileName?: string, fileUrl?: string) {
  return (fileName || fileUrl || "").split("?")[0].toLowerCase();
}

export function isImageAttachment(fileName?: string, fileUrl?: string) {
  return /\.(png|jpe?g|webp|gif)$/.test(fileBaseName(fileName, fileUrl));
}

export function isPdfAttachment(fileName?: string, fileUrl?: string) {
  return /\.pdf$/.test(fileBaseName(fileName, fileUrl));
}

/** Short type label from filename / MIME (PDF, PNG, JPEG, …). */
export function attachmentTypeLabel(
  fileName?: string,
  fileUrl?: string,
  contentType?: string
): string {
  if (contentType) {
    if (contentType === "application/pdf") return "PDF";
    if (contentType === "image/png") return "PNG";
    if (contentType === "image/jpeg") return "JPEG";
    if (contentType === "image/webp") return "WebP";
    if (contentType === "image/gif") return "GIF";
  }
  const name = fileBaseName(fileName, fileUrl);
  const ext = name.includes(".") ? name.split(".").pop()! : "";
  if (!ext) return "File";
  if (ext === "jpg" || ext === "jpeg") return "JPEG";
  if (ext === "pdf") return "PDF";
  return ext.toUpperCase();
}

export function formatFileSize(bytes?: number): string | null {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

/** e.g. "PDF · 1.2 MB" or "PNG" for list rows. */
export function attachmentMetaLabel(opts: {
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  fileContentType?: string;
}): string {
  const type = attachmentTypeLabel(
    opts.fileName,
    opts.fileUrl,
    opts.fileContentType
  );
  const size = formatFileSize(opts.fileSize);
  return size ? `${type} · ${size}` : type;
}
