"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox as InboxIcon,
  Megaphone,
  Mail,
  FileDown,
  Loader2,
  ChevronDown,
} from "lucide-react";
import type { InboxItem } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MemberInbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/member/inbox")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  async function openItem(item: InboxItem) {
    const next = openId === item._id ? null : item._id ?? null;
    setOpenId(next);

    // Mark read the first time it's opened.
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
          Announcements and documents from the College.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-16">
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
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const isOpen = openId === item._id;
              const unread = !item.readAt;
              return (
                <li
                  key={item._id}
                  className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition ${
                    unread ? "border-gold/50" : "border-navy/10"
                  }`}
                >
                  <button
                    onClick={() => openItem(item)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        item.type === "broadcast"
                          ? "bg-gold/15 text-gold-dark"
                          : "bg-navy/5 text-navy"
                      }`}
                    >
                      {item.type === "broadcast" ? (
                        <Megaphone className="h-4.5 w-4.5" />
                      ) : (
                        <Mail className="h-4.5 w-4.5" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {unread && (
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
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
                      </div>
                      <p className="mt-0.5 text-xs text-navy/45">
                        {item.type === "broadcast" ? "Announcement" : "Message"}
                        {item.fileName ? " · Attachment" : ""} ·{" "}
                        {formatDate(item.sentAt)}
                      </p>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-navy/40 transition-transform ${
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
                              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
                            >
                              <FileDown className="h-4 w-4" />
                              {item.fileName ?? "Download file"}
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
