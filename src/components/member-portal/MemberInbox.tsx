"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox as InboxIcon,
  Megaphone,
  Mail,
  FileDown,
  Loader2,
  ChevronDown,
  Award,
} from "lucide-react";
import type { InboxItem } from "@/lib/types";

type InboxFilter = "all" | "announcements" | "messages" | "certificates";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function matchesFilter(item: InboxItem, filter: InboxFilter): boolean {
  if (filter === "all") return true;
  if (filter === "announcements") return item.type === "broadcast";
  if (filter === "certificates") return item.isCertificate === true;
  return item.type === "message" && item.isCertificate !== true;
}

const FILTERS: { id: InboxFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "announcements", label: "Announcements" },
  { id: "messages", label: "Messages" },
  { id: "certificates", label: "Certificates" },
];

export default function MemberInbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InboxFilter>("all");

  useEffect(() => {
    fetch("/api/member/inbox")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(
    () => items.filter((item) => matchesFilter(item, filter)),
    [items, filter]
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      announcements: items.filter((item) => item.type === "broadcast").length,
      messages: items.filter(
        (item) => item.type === "message" && item.isCertificate !== true
      ).length,
      certificates: items.filter((item) => item.isCertificate === true).length,
    }),
    [items]
  );

  async function openItem(item: InboxItem) {
    const next = openId === item._id ? null : item._id ?? null;
    setOpenId(next);

    if (next && !item.readAt) {
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, readAt: new Date().toISOString() } : i
        )
      );
      fetch(`/api/member/inbox/${item._id}`, { method: "PATCH" }).catch(() => null);
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Member Portal
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy">
          Inbox
        </h1>
        <p className="mt-1 text-navy/55">
          Announcements, messages, and certificates from the College.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-16">
        {!loading && items.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map(({ id, label }) => {
              const count = counts[id];
              const active = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? "bg-navy text-white"
                      : "bg-white border border-navy/10 text-navy/65 hover:border-navy/25"
                  }`}
                >
                  {id === "certificates" && <Award className="h-3.5 w-3.5" />}
                  {label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      active ? "bg-white/15 text-white" : "bg-navy/5 text-navy/50"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-navy/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-card py-20 text-center">
            <InboxIcon className="h-10 w-10 text-navy/25" />
            <p className="mt-3 font-semibold text-navy">Your inbox is empty</p>
            <p className="text-sm text-navy/50">
              New messages and documents will appear here.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-card py-16 text-center">
            <p className="font-semibold text-navy">Nothing in this filter</p>
            <p className="mt-1 text-sm text-navy/50">
              Try another category above.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredItems.map((item) => {
              const isOpen = openId === item._id;
              const unread = !item.readAt;
              const isCertificate = item.isCertificate === true;

              return (
                <li
                  key={item._id}
                  className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition ${
                    unread
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
                        {unread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        )}
                        <p
                          className={`truncate ${
                            unread
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
                        {item.fileName ? " · Attachment" : ""} ·{" "}
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
                        <div className="border-t border-navy/10 px-5 py-4">
                          {isCertificate && (
                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark">
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
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                                isCertificate
                                  ? "bg-gold-dark hover:bg-gold"
                                  : "bg-navy hover:bg-navy-light"
                              }`}
                            >
                              <FileDown className="h-4 w-4" />
                              {item.fileName ??
                                (isCertificate
                                  ? "Download certificate"
                                  : "Download file")}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
