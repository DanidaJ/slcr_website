"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Loader2,
  ChevronRight,
  User,
} from "lucide-react";
import type { Correspondence } from "@/lib/types";
import type { ArchiveView, MessageAction, ReadFilter } from "@/lib/message-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/message-query";
import { notifyUnreadChanged } from "@/lib/unread-events";
import {
  MessageBulkBar,
  MessageListToolbar,
  MessagePagination,
} from "@/components/admin/MessageListControls";
import { AttachmentLabel } from "@/components/messaging/AttachmentPreview";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CorrespondenceManager() {
  const [items, setItems] = useState<Correspondence[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState<ReadFilter>("all");
  const [view, setView] = useState<ArchiveView>("inbox");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unread, setUnread] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [debouncedQuery, status, view]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(DEFAULT_PAGE_SIZE),
        status,
        view,
      });
      if (debouncedQuery) params.set("q", debouncedQuery);

      const res = await fetch(`/api/admin/correspondence?${params}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setUnread(data.unread ?? 0);
      setArchivedCount(data.archivedCount ?? 0);
    } catch {
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedQuery, view]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(items.map((i) => i._id!).filter(Boolean)));
  }

  async function runBulk(action: MessageAction) {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/correspondence", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      if (!res.ok) return;
      setSelected(new Set());
      notifyUnreadChanged();
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-extrabold text-navy">
              {view === "archived" ? "Archived correspondence" : "Correspondence"}
            </h1>
            <p className="text-sm text-navy/50">
              {view === "archived"
                ? "Messages you’ve archived. Restore any item to bring it back to the inbox."
                : "Messages sent by members to the admin team."}
            </p>
          </div>
          {view === "inbox" && unread > 0 && (
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {unread} unread
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 pb-16">
        <MessageListToolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          view={view}
          archivedCount={archivedCount}
          onViewChange={setView}
          searchPlaceholder="Search name, email, subject, or message…"
        />

        <MessageBulkBar
          selectedCount={selected.size}
          view={view}
          busy={busy}
          onMarkRead={() => runBulk("read")}
          onMarkUnread={() => runBulk("unread")}
          onArchive={() => runBulk("archive")}
          onUnarchive={() => runBulk("unarchive")}
          onClear={() => setSelected(new Set())}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20 text-navy/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-card py-20 text-center">
            <MessageSquare className="h-10 w-10 text-navy/25" />
            <p className="mt-3 font-semibold text-navy">
              {view === "archived"
                ? "No archived correspondence"
                : debouncedQuery || status !== "all"
                  ? "No matching correspondence"
                  : "No correspondence yet"}
            </p>
            <p className="text-sm text-navy/50">
              {view === "archived"
                ? "Archived messages will appear here."
                : debouncedQuery || status !== "all"
                  ? "Try a different search or filter."
                  : "Messages sent by members will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center gap-2 px-1">
              <input
                type="checkbox"
                checked={selected.size > 0 && selected.size === items.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-navy/30 text-navy focus:ring-navy/30"
                aria-label="Select all on this page"
              />
              <span className="text-xs text-navy/45">Select all on page</span>
            </div>

            <ul className="space-y-3">
              {items.map((item) => {
                const isUnread = !item.readAt;
                const id = item._id!;
                return (
                  <li key={id} className="flex items-stretch gap-2">
                    <label className="flex items-center px-1">
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleSelect(id)}
                        className="h-4 w-4 rounded border-navy/30 text-navy focus:ring-navy/30"
                        aria-label={`Select ${item.subject}`}
                      />
                    </label>
                    <Link
                      href={`/admin/correspondence/${id}`}
                      className={`flex min-w-0 flex-1 items-center gap-4 rounded-2xl border bg-card px-5 py-4 shadow-sm transition hover:border-navy/25 ${
                        isUnread ? "border-gold/50" : "border-navy/10"
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                        <User className="h-4.5 w-4.5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {isUnread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                          )}
                          <p
                            className={`text-sm ${
                              isUnread
                                ? "font-bold text-navy"
                                : "font-medium text-navy/80"
                            }`}
                          >
                            {item.memberName}
                          </p>
                          <span className="truncate text-xs text-navy/40">
                            {item.memberEmail}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-sm font-semibold text-navy">
                          {item.subject}
                        </p>
                        <p className="mt-0.5 text-xs text-navy/40">
                          {item.fileName || item.fileUrl ? (
                            <>
                              <AttachmentLabel
                                fileName={item.fileName}
                                fileUrl={item.fileUrl}
                                fileSize={item.fileSize}
                                fileContentType={item.fileContentType}
                              />
                              {" · "}
                            </>
                          ) : null}
                          {formatDate(item.sentAt)}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-navy/40" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <MessagePagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={DEFAULT_PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
