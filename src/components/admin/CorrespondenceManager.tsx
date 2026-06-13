"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Loader2,
  ChevronDown,
  Paperclip,
  FileDown,
  User,
} from "lucide-react";
import type { Correspondence } from "@/lib/types";

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
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/correspondence")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  async function openItem(item: Correspondence) {
    const next = openId === item._id ? null : item._id ?? null;
    setOpenId(next);

    if (next && !item.readAt) {
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, readAt: new Date().toISOString() } : i
        )
      );
      fetch(`/api/admin/correspondence/${item._id}`, { method: "PATCH" }).catch(
        () => null
      );
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-6">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          Correspondence
        </h1>
        <p className="text-sm text-navy/50">
          Messages sent by members to the admin team.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-navy/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-card py-20 text-center">
            <MessageSquare className="h-10 w-10 text-navy/25" />
            <p className="mt-3 font-semibold text-navy">No correspondence yet</p>
            <p className="text-sm text-navy/50">
              Messages sent by members will appear here.
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
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    {/* Sender avatar */}
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                      <User className="h-4.5 w-4.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      {/* Sender info */}
                      <div className="flex items-center gap-2">
                        {unread && (
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                        )}
                        <p
                          className={`text-sm ${
                            unread ? "font-bold text-navy" : "font-medium text-navy/80"
                          }`}
                        >
                          {item.memberName}
                        </p>
                        <span className="text-xs text-navy/40 truncate">
                          {item.memberEmail}
                        </span>
                      </div>
                      {/* Subject */}
                      <p className="mt-0.5 truncate text-sm font-semibold text-navy">
                        {item.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-navy/40">
                        {item.fileName ? (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            Attachment ·{" "}
                          </span>
                        ) : null}
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
                        <div className="border-t border-navy/10 px-5 py-4 space-y-4">
                          {/* Sender card */}
                          <div className="flex items-center gap-3 rounded-lg bg-navy/5 px-4 py-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold flex-shrink-0">
                              {item.memberName
                                .split(" ")
                                .filter((p) => !/^dr\.?$/i.test(p))
                                .slice(0, 2)
                                .map((p) => p[0])
                                .join("")
                                .toUpperCase() || "?"}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-navy">
                                {item.memberName}
                              </p>
                              <p className="text-xs text-navy/55">
                                {item.memberEmail}
                              </p>
                            </div>
                          </div>

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
                              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
                            >
                              <FileDown className="h-4 w-4" />
                              {item.fileName ?? "Download attachment"}
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
