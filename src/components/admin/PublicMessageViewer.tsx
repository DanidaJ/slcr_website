"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, MessageSquare } from "lucide-react";
import type { PublicMessage } from "@/lib/types";

export default function PublicMessageViewer() {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/public-messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function openMessage(msg: PublicMessage) {
    const id = msg._id!;
    setOpenId((prev) => (prev === id ? null : id));

    if (!msg.readAt) {
      await fetch(`/api/admin/public-messages/${id}`, { method: "PATCH" }).catch(
        () => null
      );
      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, readAt: new Date().toISOString() } : m
        )
      );
    }
  }

  const unread = messages.filter((m) => !m.readAt).length;

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-navy/60" />
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-navy">
              Public Messages
            </h1>
            <p className="text-sm text-navy/50">
              Messages submitted via the Contact Us form
            </p>
          </div>
          {unread > 0 && (
            <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {unread} unread
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 pb-12">
        <div className="rounded-2xl border border-navy/10 bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-12 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-navy/50 py-12 text-center">
              No messages yet.
            </p>
          ) : (
            <ul className="divide-y divide-navy/10">
              {messages.map((msg) => {
                const isOpen = openId === msg._id;
                const isRead = !!msg.readAt;
                return (
                  <li key={msg._id}>
                    <button
                      onClick={() => openMessage(msg)}
                      className="w-full text-left px-6 py-4 hover:bg-navy/5 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {isRead ? (
                          <MailOpen className="w-4 h-4 text-navy/30 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
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
                            <span className="ml-auto text-[11px] text-navy/35 flex-shrink-0">
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
                              isRead ? "text-navy/50" : "text-navy/70 font-medium"
                            }`}
                          >
                            {msg.subject}
                          </p>
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 bg-navy/[0.02] border-t border-navy/8">
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
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
