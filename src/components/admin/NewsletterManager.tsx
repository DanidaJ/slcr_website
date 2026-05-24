"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Loader2,
  Trash2,
  FileText,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Newsletter } from "@/lib/types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Status = { type: "idle" | "success" | "error"; message?: string };

export default function NewsletterManager() {
  const router = useRouter();
  const [list, setList] = useState<Newsletter[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("Radiology News");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadList() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/newsletters");
      const data = await res.json();
      setList(data.newsletters ?? []);
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
      setStatus({ type: "error", message: "Please choose a PDF file." });
      return;
    }
    if (file.type !== "application/pdf") {
      setStatus({ type: "error", message: "Only PDF files are allowed." });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Get a presigned upload URL.
      const presign = await fetch("/api/newsletters/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!presign.ok) {
        const d = await presign.json().catch(() => ({}));
        throw new Error(d.error || "Could not start upload.");
      }
      const { uploadUrl, key, publicUrl } = await presign.json();

      // 2. Upload the file straight to R2.
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error("Upload to storage failed.");

      // 3. Save the metadata record.
      const create = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          volume: volume || undefined,
          issue: issue || undefined,
          month: month || undefined,
          year,
          pdfUrl: publicUrl,
          pdfKey: key,
          publishedAt: month
            ? new Date(
                `${month} 1, ${year}`
              ).toISOString()
            : new Date(`${year}-01-01`).toISOString(),
        }),
      });
      if (!create.ok) {
        const d = await create.json().catch(() => ({}));
        throw new Error(d.error || "Could not save newsletter.");
      }

      setStatus({ type: "success", message: "Newsletter published." });
      setFile(null);
      setVolume("");
      setIssue("");
      setMonth("");
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
    if (!confirm("Delete this newsletter? This cannot be undone.")) return;
    const res = await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((n) => n._id !== id));
    } else {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="border-b border-navy/10 bg-navy">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-lg font-extrabold text-white">
              Newsletter Admin
            </h1>
            <p className="text-xs text-white/55">Sri Lanka College of Radiologists</p>
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
        {/* Upload form */}
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy">
            Add a Newsletter
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Upload a PDF and fill in the details. It appears on the public page
            instantly.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* File */}
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                PDF File
              </label>
              <label
                htmlFor="pdf-input"
                className="flex items-center gap-3 cursor-pointer rounded-lg border border-dashed border-navy/25 px-4 py-3 hover:border-gold transition-colors"
              >
                <Upload className="w-5 h-5 text-navy/50" />
                <span className="text-sm text-navy/70 truncate">
                  {file ? file.name : "Choose a PDF…"}
                </span>
              </label>
              <input
                id="pdf-input"
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>

            {/* Title */}
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

            {/* Meta row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-1.5">
                  Volume
                </label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-1.5">
                  Issue
                </label>
                <input
                  type="number"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-1.5">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition bg-white"
                >
                  <option value="">—</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-1.5">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                  placeholder="2026"
                />
              </div>
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
              {submitting ? "Publishing…" : "Publish Newsletter"}
            </button>
          </form>
        </section>

        {/* Existing list */}
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy mb-4">
            Published Newsletters
          </h2>

          {loadingList ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-navy/50 py-6">No newsletters yet.</p>
          ) : (
            <ul className="divide-y divide-navy/10">
              {list.map((n) => (
                <li
                  key={n._id}
                  className="flex items-center gap-4 py-3.5"
                >
                  <FileText className="w-5 h-5 text-gold flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-navy font-medium truncate">{n.title}</p>
                    <p className="text-xs text-navy/50">
                      {[
                        n.volume && `Vol ${n.volume}`,
                        n.issue && `Issue ${n.issue}`,
                        n.month ? `${n.month} ${n.year}` : n.year,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <a
                    href={n.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-navy/60 hover:text-gold transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => n._id && handleDelete(n._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete newsletter"
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
