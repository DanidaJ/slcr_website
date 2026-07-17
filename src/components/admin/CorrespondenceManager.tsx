"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Loader2,
  ChevronRight,
  Paperclip,
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

  useEffect(() => {
    fetch("/api/admin/correspondence")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

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
              const unread = !item.readAt;
              return (
                <li key={item._id}>
                  <Link
                    href={`/admin/correspondence/${item._id}`}
                    className={`flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 shadow-sm transition hover:border-navy/25 ${
                      unread ? "border-gold/50" : "border-navy/10"
                    }`}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                      <User className="h-4.5 w-4.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {unread && (
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                        )}
                        <p
                          className={`text-sm ${
                            unread
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
                        {item.fileName ? (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            Attachment ·{" "}
                          </span>
                        ) : null}
                        {formatDate(item.sentAt)}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-navy/40" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
