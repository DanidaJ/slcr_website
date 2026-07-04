"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Megaphone,
  Trash2,
} from "lucide-react";
import { isHomeAnnouncementActive } from "@/lib/homeAnnouncement";
import type { HomeAnnouncement } from "@/lib/types";

type Status = { type: "idle" | "success" | "error"; message?: string };

export default function HomeAnnouncementManager() {
  const [current, setCurrent] = useState<HomeAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/home-announcement");
      const data = await res.json();
      const announcement = (data.announcement as HomeAnnouncement | null) ?? null;
      setCurrent(announcement);
      setMessage(announcement?.message ?? "");
      setExpiresAt(announcement?.expiresAt.slice(0, 10) ?? "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus({ type: "idle" });

    if (!message.trim()) {
      setStatus({ type: "error", message: "Message is required." });
      return;
    }
    if (!expiresAt) {
      setStatus({ type: "error", message: "Expiration date is required." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/home-announcement", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), expiresAt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not save announcement.");
      }

      setCurrent(data.announcement ?? null);
      setStatus({ type: "success", message: "Announcement saved." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Remove this announcement from the home page?")) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/home-announcement", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Could not remove announcement.");

      setCurrent(null);
      setMessage("");
      setExpiresAt("");
      setStatus({ type: "success", message: "Announcement removed." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const isActive = current ? isHomeAnnouncementActive(current.expiresAt) : false;

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-navy/60" />
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-navy">
              Home Page Announcement
            </h1>
            <p className="text-sm text-navy/50">
              Limited-time message shown under Annual Academic Sessions 2026 on
              the home page
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-12">
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              {current && (
                <div
                  className={`mb-6 rounded-lg px-4 py-3 text-sm ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {isActive
                    ? "This announcement is currently visible on the home page."
                    : "This announcement has expired and is hidden from the home page."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="announcement-message"
                    className="block text-sm font-medium text-navy/70 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="announcement-message"
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="e.g. Early bird registration closes 15 July 2026."
                    className="w-full rounded-lg border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="announcement-expires"
                    className="block text-sm font-medium text-navy/70 mb-1.5"
                  >
                    Show until (inclusive)
                  </label>
                  <input
                    id="announcement-expires"
                    type="date"
                    value={expiresAt}
                    onChange={(event) => setExpiresAt(event.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-navy/15 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                  <p className="mt-1.5 text-xs text-navy/45">
                    The icon and message disappear from the home page after this
                    date.
                  </p>
                </div>

                {status.type !== "idle" && (
                  <div
                    className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 ${
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    {status.message}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/90 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {submitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Save announcement
                  </button>

                  {current && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
