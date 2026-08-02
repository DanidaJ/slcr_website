"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Loader2,
  Mail,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import type { Correspondence } from "@/lib/types";
import { attachmentMetaLabel } from "@/lib/message-query";
import { notifyUnreadChanged } from "@/lib/unread-events";
import AttachmentPreview from "@/components/messaging/AttachmentPreview";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter((p) => !/^dr\.?$/i.test(p))
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export default function CorrespondenceDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Correspondence | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    fetch(`/api/admin/correspondence/${id}`)
      .then(async (r) => {
        if (r.status === 404) {
          if (active) setNotFound(true);
          return null;
        }
        const d = await r.json();
        return d.item as Correspondence | undefined;
      })
      .then(async (fetched) => {
        if (!active) return;
        if (!fetched) {
          setNotFound(true);
          return;
        }
        setItem(fetched);
        if (!fetched.readAt && !fetched.archivedAt) {
          await fetch(`/api/admin/correspondence/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "read" }),
          }).catch(() => null);
          if (!active) return;
          setItem({ ...fetched, readAt: new Date().toISOString() });
          notifyUnreadChanged();
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function runAction(action: "unread" | "archive" | "unarchive") {
    if (!item) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/correspondence/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) return;

      if (action === "unread") {
        setItem({ ...item, readAt: undefined });
      } else if (action === "archive") {
        setItem({ ...item, archivedAt: new Date().toISOString() });
      } else {
        setItem({ ...item, archivedAt: undefined });
      }
      notifyUnreadChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <Link
          href="/admin/correspondence"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy/60 transition-colors hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          All correspondence
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-navy/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : notFound || !item ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-card py-20 text-center">
            <MessageSquare className="h-10 w-10 text-navy/25" />
            <p className="mt-3 font-semibold text-navy">Message not found</p>
            <p className="text-sm text-navy/50">
              This correspondence may have been removed.
            </p>
          </div>
        ) : (
          <article className="mt-6 overflow-hidden rounded-2xl border border-navy/10 bg-card shadow-sm">
            <header className="border-b border-navy/10 px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy/45">
                    Correspondence
                    {item.archivedAt ? " · Archived" : ""}
                  </p>
                  <h1 className="mt-1 font-heading text-xl font-extrabold text-navy sm:text-2xl">
                    {item.subject}
                  </h1>
                  <p className="mt-1 text-sm text-navy/45">
                    {formatDate(item.sentAt)}
                    {item.fileName || item.fileUrl ? (
                      <span className="ml-2 inline-flex items-center gap-1">
                        · <Paperclip className="h-3 w-3" />
                        {attachmentMetaLabel({
                          fileName: item.fileName,
                          fileUrl: item.fileUrl,
                          fileSize: item.fileSize,
                          fileContentType: item.fileContentType,
                        })}
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.readAt ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => runAction("unread")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Mark unread
                    </button>
                  ) : null}
                  {item.archivedAt ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => runAction("unarchive")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                    >
                      <ArchiveRestore className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => runAction("archive")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </header>

            <div className="px-5 py-5 sm:px-6 space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6264A7] text-sm font-bold text-white">
                  {initials(item.memberName)}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-base font-semibold text-navy">
                    {item.memberName}
                  </p>
                  <p className="text-sm text-navy/50">{item.memberEmail}</p>
                </div>
              </div>

              {item.body ? (
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-navy/80">
                  {item.body}
                </p>
              ) : (
                <p className="text-sm italic text-navy/45">
                  No message text — see attachment below.
                </p>
              )}

              {item.fileUrl && (
                <AttachmentPreview
                  fileUrl={item.fileUrl}
                  fileName={item.fileName}
                  fileSize={item.fileSize}
                  fileContentType={item.fileContentType}
                />
              )}

              {item.archivedAt && (
                <p className="text-xs text-navy/40">
                  This message is archived.{" "}
                  <Link
                    href="/admin/correspondence"
                    className="font-medium text-navy/60 underline-offset-2 hover:underline"
                  >
                    Back to correspondence
                  </Link>
                </p>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
