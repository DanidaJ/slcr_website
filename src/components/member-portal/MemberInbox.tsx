"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  ArchiveRestore,
  Award,
  ChevronDown,
  Inbox as InboxIcon,
  Loader2,
  Mail,
  Megaphone,
} from "lucide-react";
import type { InboxItem } from "@/lib/types";
import type { ArchiveView, MessageAction, ReadFilter } from "@/lib/message-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/message-query";
import { notifyUnreadChanged } from "@/lib/unread-events";
import {
  MessageBulkBar,
  MessageListToolbar,
  MessagePagination,
} from "@/components/admin/MessageListControls";
import AttachmentPreview, {
  AttachmentLabel,
} from "@/components/messaging/AttachmentPreview";

type InboxTypeFilter = "all" | "announcements" | "messages" | "certificates";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TYPE_FILTERS: { id: InboxTypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "announcements", label: "Announcements" },
  { id: "messages", label: "Messages" },
  { id: "certificates", label: "Certificates" },
];

export default function MemberInbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<InboxTypeFilter>("all");
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
    setOpenId(null);
  }, [debouncedQuery, status, view, typeFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(DEFAULT_PAGE_SIZE),
        status,
        view,
        type: typeFilter,
      });
      if (debouncedQuery) params.set("q", debouncedQuery);

      const res = await fetch(`/api/member/inbox?${params}`);
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
  }, [page, status, debouncedQuery, view, typeFilter]);

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
      const res = await fetch("/api/member/inbox", {
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

  async function openItem(item: InboxItem) {
    const next = openId === item._id ? null : item._id ?? null;
    setOpenId(next);

    if (next && !item.readAt && view === "inbox") {
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, readAt: new Date().toISOString() } : i
        )
      );
      setUnread((prev) => Math.max(0, prev - 1));
      await fetch(`/api/member/inbox/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      }).catch(() => null);
      notifyUnreadChanged();
    }
  }

  async function runItemAction(
    item: InboxItem,
    action: "unread" | "archive" | "unarchive"
  ) {
    setBusy(true);
    try {
      const res = await fetch(`/api/member/inbox/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) return;

      if (action === "unread") {
        setItems((prev) =>
          prev.map((i) =>
            i._id === item._id ? { ...i, readAt: undefined } : i
          )
        );
        setUnread((prev) => prev + 1);
        notifyUnreadChanged();
        return;
      }

      notifyUnreadChanged();
      setOpenId(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Member Portal
            </p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy">
              {view === "archived" ? "Archived inbox" : "Inbox"}
            </h1>
            <p className="mt-1 text-navy/55">
              {view === "archived"
                ? "Messages you’ve archived. Restore any item to bring it back."
                : "Announcements, messages, and certificates from the College."}
            </p>
          </div>
          {view === "inbox" && unread > 0 && (
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {unread} unread
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-16">
        <MessageListToolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          view={view}
          archivedCount={archivedCount}
          onViewChange={setView}
          searchPlaceholder="Search subject or message…"
        />

        {view === "inbox" && (
          <div className="mb-4 flex flex-wrap gap-2">
            {TYPE_FILTERS.map(({ id, label }) => {
              const active = typeFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTypeFilter(id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? "bg-navy text-white"
                      : "bg-white border border-navy/10 text-navy/65 hover:border-navy/25"
                  }`}
                >
                  {id === "certificates" && <Award className="h-3.5 w-3.5" />}
                  {label}
                </button>
              );
            })}
          </div>
        )}

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
            <InboxIcon className="h-10 w-10 text-navy/25" />
            <p className="mt-3 font-semibold text-navy">
              {view === "archived"
                ? "No archived messages"
                : debouncedQuery || status !== "all" || typeFilter !== "all"
                  ? "No matching messages"
                  : "Your inbox is empty"}
            </p>
            <p className="text-sm text-navy/50">
              {view === "archived"
                ? "Archived items will appear here."
                : debouncedQuery || status !== "all" || typeFilter !== "all"
                  ? "Try a different search or filter."
                  : "New messages and documents will appear here."}
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
                const id = item._id!;
                const isOpen = openId === id;
                const isUnread = !item.readAt;
                const isCertificate = item.isCertificate === true;

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

                    <div
                      className={`min-w-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm transition ${
                        isUnread
                          ? isCertificate
                            ? "border-gold/60"
                            : "border-gold/50"
                          : isCertificate
                            ? "border-gold/25"
                            : "border-navy/10"
                      }`}
                    >
                      <button
                        onClick={() => openItem(item)}
                        className="flex w-full items-center gap-3 px-5 py-4 text-left"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            item.type === "broadcast"
                              ? "bg-gold/15 text-gold-dark"
                              : isCertificate
                                ? "bg-gold/20 text-gold-dark"
                                : "bg-navy/5 text-navy"
                          }`}
                        >
                          {item.type === "broadcast" ? (
                            <Megaphone className="h-4.5 w-4.5" />
                          ) : isCertificate ? (
                            <Award className="h-4.5 w-4.5" />
                          ) : (
                            <Mail className="h-4.5 w-4.5" />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                            )}
                            <p
                              className={`truncate ${
                                isUnread
                                  ? "font-bold text-navy"
                                  : "font-medium text-navy/80"
                              }`}
                            >
                              {item.subject}
                            </p>
                            {isCertificate && (
                              <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-dark">
                                Certificate
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-navy/45">
                            {item.type === "broadcast"
                              ? "Announcement"
                              : isCertificate
                                ? "Certificate"
                                : "Message"}
                            {item.fileName || item.fileUrl ? (
                              <>
                                {" · "}
                                <AttachmentLabel
                                  fileName={item.fileName}
                                  fileUrl={item.fileUrl}
                                  fileSize={item.fileSize}
                                  fileContentType={item.fileContentType}
                                />
                              </>
                            ) : null}
                            {" · "}
                            {formatDate(item.sentAt)}
                          </p>
                        </div>

                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-navy/40 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-navy/10 px-5 py-4 space-y-4">
                              {isCertificate && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark">
                                  <Award className="h-3.5 w-3.5" />
                                  Official certificate
                                </div>
                              )}
                              {item.body && (
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy/75">
                                  {item.body}
                                </p>
                              )}
                              {item.fileUrl && (
                                <AttachmentPreview
                                  fileUrl={item.fileUrl}
                                  fileName={item.fileName}
                                  fileSize={item.fileSize}
                                  fileContentType={item.fileContentType}
                                  accent={isCertificate ? "gold" : "navy"}
                                />
                              )}
                              <div className="flex flex-wrap gap-2">
                                {item.readAt && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => runItemAction(item, "unread")}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                                  >
                                    <Mail className="h-3.5 w-3.5" />
                                    Mark unread
                                  </button>
                                )}
                                {view === "archived" ? (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      runItemAction(item, "unarchive")
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                                  >
                                    <ArchiveRestore className="h-3.5 w-3.5" />
                                    Restore
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      runItemAction(item, "archive")
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                                  >
                                    <Archive className="h-3.5 w-3.5" />
                                    Archive
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
