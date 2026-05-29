"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Loader2,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { NewsEvent } from "@/lib/types";

type Status = { type: "idle" | "success" | "error"; message?: string };

export default function NewsEventManager() {
  const router = useRouter();
  const [list, setList] = useState<NewsEvent[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadList() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/news-events");
      const data = await res.json();
      setList(data.newsEvents ?? []);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle" });

    if (!file) {
      setStatus({ type: "error", message: "Please choose a thumbnail image." });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Only image files are allowed." });
      return;
    }
    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required." });
      return;
    }
    if (!excerpt.trim()) {
      setStatus({ type: "error", message: "Short description is required." });
      return;
    }

    setSubmitting(true);
    try {
      const presign = await fetch("/api/news-events/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });
      if (!presign.ok) {
        const d = await presign.json().catch(() => ({}));
        throw new Error(d.error || "Could not start upload.");
      }
      const { uploadUrl, key, publicUrl } = await presign.json();

      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error("Upload to storage failed.");

      const publishedIso = publishedAt
        ? new Date(`${publishedAt}T12:00:00`).toISOString()
        : new Date().toISOString();

      const create = await fetch("/api/news-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          bodyText: bodyText.trim() || excerpt.trim(),
          imageUrl: publicUrl,
          imageKey: key,
          publishedAt: publishedIso,
        }),
      });
      if (!create.ok) {
        const d = await create.json().catch(() => ({}));
        throw new Error(d.error || "Could not save post.");
      }

      setStatus({ type: "success", message: "News item published." });
      setFile(null);
      setTitle("");
      setExcerpt("");
      setBodyText("");
      setPublishedAt(new Date().toISOString().slice(0, 10));
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadList();
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this news item? This cannot be undone.")) return;
    const res = await fetch(`/api/news-events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((n) => n._id !== id));
    } else {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-navy/10 bg-navy">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-lg font-extrabold text-white">
              News &amp; Events Admin
            </h1>
            <p className="text-xs text-white/55">
              Sri Lanka College of Radiologists
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/25 text-white/85 text-sm hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 space-y-8">
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy">
            Add News or Event
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Upload a thumbnail and fill in the details. It appears on the public
            page instantly.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Thumbnail Image
              </label>
              <label
                htmlFor="news-image-input"
                className="flex items-center gap-3 cursor-pointer rounded-lg border border-dashed border-navy/25 px-4 py-3 hover:border-gold transition-colors"
              >
                <Upload className="w-5 h-5 text-navy/50" />
                <span className="text-sm text-navy/70 truncate">
                  {file ? file.name : "Choose JPEG, PNG, or WebP…"}
                </span>
              </label>
              <input
                id="news-image-input"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Short Description (excerpt)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition resize-y"
                placeholder="Shown on the listing page"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Full Content
              </label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition resize-y"
                placeholder="Separate paragraphs with a blank line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
              />
            </div>

            {status.type !== "idle" && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  status.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-white font-semibold hover:bg-navy-light disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {submitting ? "Publishing…" : "Publish"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy mb-4">
            Published Items
          </h2>

          {loadingList ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-navy/50 py-6">No items yet.</p>
          ) : (
            <ul className="divide-y divide-navy/10">
              {list.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-navy font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-navy/50">
                      {new Date(item.publishedAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <Link
                    href={`/news-and-events/${item.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-navy/60 hover:text-gold transition-colors"
                  >
                    View
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => item._id && handleDelete(item._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete news item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
