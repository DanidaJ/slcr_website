"use client";

import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailOpen,
  Search,
  X,
} from "lucide-react";
import type { ArchiveView, ReadFilter } from "@/lib/message-query";

type MessageListToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  status: ReadFilter;
  onStatusChange: (value: ReadFilter) => void;
  searchPlaceholder?: string;
  view: ArchiveView;
  archivedCount: number;
  onViewChange: (view: ArchiveView) => void;
};

export function MessageListToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  searchPlaceholder = "Search sender, email, or message…",
  view,
  archivedCount,
  onViewChange,
}: MessageListToolbarProps) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-navy/15 bg-white py-2.5 pl-10 pr-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-navy/35 focus:ring-2 focus:ring-navy/10"
            aria-label="Search messages"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-navy/60 sm:shrink-0">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Show</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ReadFilter)}
            className="rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm font-medium text-navy outline-none transition focus:border-navy/35 focus:ring-2 focus:ring-navy/10"
            aria-label="Filter by read status"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </label>
      </div>

      {view === "archived" ? (
        <button
          type="button"
          onClick={() => onViewChange("inbox")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy/60 transition-colors hover:text-navy"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to inbox
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onViewChange("archived")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy/55 transition-colors hover:text-navy"
        >
          <Archive className="h-3.5 w-3.5" />
          View archived
          {archivedCount > 0 && (
            <span className="rounded-full bg-navy/8 px-1.5 py-0.5 text-[10px] font-semibold text-navy/55">
              {archivedCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

type MessageBulkBarProps = {
  selectedCount: number;
  view: ArchiveView;
  busy?: boolean;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onClear: () => void;
};

export function MessageBulkBar({
  selectedCount,
  view,
  busy,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onUnarchive,
  onClear,
}: MessageBulkBarProps) {
  if (selectedCount === 0) return null;

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-navy/30 hover:bg-navy/5 disabled:opacity-50";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-navy/10 bg-navy/[0.03] px-3 py-2.5">
      <span className="mr-1 text-xs font-semibold text-navy/70">
        {selectedCount} selected
      </span>
      <button type="button" className={btn} disabled={busy} onClick={onMarkRead}>
        <MailOpen className="h-3.5 w-3.5" />
        Mark read
      </button>
      <button type="button" className={btn} disabled={busy} onClick={onMarkUnread}>
        <Mail className="h-3.5 w-3.5" />
        Mark unread
      </button>
      {view === "archived" ? (
        <button type="button" className={btn} disabled={busy} onClick={onUnarchive}>
          <ArchiveRestore className="h-3.5 w-3.5" />
          Restore
        </button>
      ) : (
        <button type="button" className={btn} disabled={busy} onClick={onArchive}>
          <Archive className="h-3.5 w-3.5" />
          Archive
        </button>
      )}
      <button
        type="button"
        className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-navy/45 transition hover:text-navy"
        onClick={onClear}
        aria-label="Clear selection"
      >
        <X className="h-3.5 w-3.5" />
        Clear
      </button>
    </div>
  );
}

type MessagePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function MessagePagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: MessagePaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-navy/45">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition enabled:hover:border-navy/30 enabled:hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <span className="min-w-[4.5rem] text-center text-xs font-medium text-navy/60">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition enabled:hover:border-navy/30 enabled:hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
