"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Loader2,
  Mail,
  MailOpen,
  MessageSquare,
} from "lucide-react";
import type { PublicMessage } from "@/lib/types";
import type { ArchiveView, MessageAction, ReadFilter } from "@/lib/message-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/message-query";
import { notifyUnreadChanged } from "@/lib/unread-events";
import {
  MessageBulkBar,
  MessageListToolbar,
  MessagePagination,
} from "@/components/admin/MessageListControls";

export default function PublicMessageViewer() {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
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

      const res = await fetch(`/api/admin/public-messages?${params}`);
      const data = await res.json();
      setMessages(data.messages ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setUnread(data.unread ?? 0);
      setArchivedCount(data.archivedCount ?? 0);
    } catch {
      setMessages([]);
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
    if (selected.size === messages.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(messages.map((m) => m._id!).filter(Boolean)));
  }

  async function runBulk(action: MessageAction) {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/public-messages", {
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

  async function openMessage(msg: PublicMessage) {
    const id = msg._id!;
    setOpenId((prev) => (prev === id ? null : id));

    if (!msg.readAt && view === "inbox") {
      await fetch(`/api/admin/public-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      }).catch(() => null);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, readAt: new Date().toISOString() } : m
        )
      );
      setUnread((prev) => Math.max(0, prev - 1));
      notifyUnreadChanged();
    }
  }

  async function runItemAction(
    msg: PublicMessage,
    action: "unread" | "archive" | "unarchive"
  ) {
    const id = msg._id!;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/public-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) return;

      if (action === "unread") {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === id ? { ...m, readAt: undefined } : m
          )
        );
        setUnread((prev) => prev + 1);
        notifyUnreadChanged();
        return;
      }

      // archive / unarchive — reload list so the item leaves this view
      notifyUnreadChanged();
      setOpenId(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-navy/60" />
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-extrabold text-navy">
              {view === "archived" ? "Archived public messages" : "Public Messages"}
            </h1>
            <p className="text-sm text-navy/50">
              {view === "archived"
                ? "Messages you’ve archived from the Contact Us form."
                : "Messages submitted via the Contact Us form"}
            </p>
          </div>
          {view === "inbox" && unread > 0 && (
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {unread} unread
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 pb-12">
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

        <div className="rounded-2xl border border-navy/10 bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-12 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-navy/50 py-12 text-center">
              {view === "archived"
                ? "No archived messages."
                : debouncedQuery || status !== "all"
                  ? "No matching messages."
                  : "No messages yet."}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-navy/8 px-6 py-2.5">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === messages.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-navy/30 text-navy focus:ring-navy/30"
                  aria-label="Select all on this page"
                />
                <span className="text-xs text-navy/45">Select all on page</span>
              </div>
              <ul className="divide-y divide-navy/10">
                {messages.map((msg) => {
                  const id = msg._id!;
                  const isOpen = openId === id;
                  const isRead = !!msg.readAt;
                  return (
                    <li key={id}>
                      <div className="flex items-start gap-2 px-4 sm:px-6">
                        <label className="pt-5">
                          <input
                            type="checkbox"
                            checked={selected.has(id)}
                            onChange={() => toggleSelect(id)}
                            className="h-4 w-4 rounded border-navy/30 text-navy focus:ring-navy/30"
                            aria-label={`Select ${msg.subject}`}
                          />
                        </label>
                        <button
                          onClick={() => openMessage(msg)}
                          className="min-w-0 flex-1 text-left py-4 hover:bg-navy/5 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {isRead ? (
                              <MailOpen className="w-4 h-4 text-navy/30 mt-0.5 shrink-0" />
                            ) : (
                              <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span
                                  className={`text-sm truncate ${
                                    isRead
                                      ? "text-navy/70 font-normal"
                                      : "text-navy font-semibold"
                                  }`}
                                >
                                  {msg.name}
                                </span>
                                <span className="text-navy/40 text-xs truncate">
                                  {msg.email}
                                </span>
                                <span className="ml-auto text-[11px] text-navy/35 shrink-0">
                                  {new Date(msg.sentAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p
                                className={`text-xs mt-0.5 truncate ${
                                  isRead
                                    ? "text-navy/50"
                                    : "text-navy/70 font-medium"
                                }`}
                              >
                                {msg.subject}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      {isOpen && (
                        <div className="px-6 pb-5 ml-6 sm:ml-10 bg-navy/[0.02] border-t border-navy/8">
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-navy/60 mb-4">
                            <p>
                              <span className="font-semibold text-navy/80">From:</span>{" "}
                              {msg.name} &lt;{msg.email}&gt;
                            </p>
                            <p>
                              <span className="font-semibold text-navy/80">Subject:</span>{" "}
                              {msg.subject}
                            </p>
                            <p>
                              <span className="font-semibold text-navy/80">Received:</span>{" "}
                              {new Date(msg.sentAt).toLocaleString("en-GB", {
                                dateStyle: "full",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                          <div className="rounded-lg bg-white border border-navy/10 px-4 py-3 text-sm text-navy/80 whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.readAt && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => runItemAction(msg, "unread")}
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
                                onClick={() => runItemAction(msg, "unarchive")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                              >
                                <ArchiveRestore className="h-3.5 w-3.5" />
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => runItemAction(msg, "archive")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-50"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                Archive
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {!loading && (
          <MessagePagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={DEFAULT_PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
