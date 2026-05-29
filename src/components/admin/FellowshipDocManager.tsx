"use client";

import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { FellowshipDocument } from "@/lib/types";

type Status = { type: "idle" | "success" | "error"; message?: string };

export default function FellowshipDocManager() {
  const [list, setList] = useState<FellowshipDocument[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadList() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/membership/fellowship");
      const data = await res.json();
      setList(data.documents ?? []);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

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
    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required." });
      return;
    }

    setSubmitting(true);
    try {
      const presign = await fetch("/api/membership/fellowship/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
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

      const create = await fetch("/api/membership/fellowship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          pdfUrl: publicUrl,
          pdfKey: key,
        }),
      });
      if (!create.ok) {
        const d = await create.json().catch(() => ({}));
        throw new Error(d.error || "Could not save document.");
      }

      setStatus({ type: "success", message: "Document uploaded." });
      setFile(null);
      setTitle("");
      setDescription("");
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
    if (!confirm("Delete this document? This cannot be undone.")) return;
    const res = await fetch(`/api/membership/fellowship/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setList((prev) => prev.filter((d) => d._id !== id));
    } else {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6">
        <h1 className="font-heading text-2xl font-extrabold text-navy">Fellowship Documents Admin</h1>
        <p className="text-sm text-navy/50">Manage fellowship documents</p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 pb-12 space-y-8">
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy">
            Upload Fellowship Document
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Upload a PDF (e.g. fellowship guidelines, nomination form). It
            appears on the Fellowship page instantly.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                placeholder="e.g. Fellowship Guidelines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Description{" "}
                <span className="text-navy/40 font-normal">(optional)</span>
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                placeholder="e.g. Point chart and criteria for FSLCR nomination"
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
              {submitting ? "Uploading…" : "Upload Document"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy mb-4">
            Uploaded Documents
          </h2>

          {loadingList ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-navy/50 py-6">No documents yet.</p>
          ) : (
            <ul className="divide-y divide-navy/10">
              {list.map((doc) => (
                <li key={doc._id} className="flex items-center gap-4 py-3.5">
                  <FileText className="w-5 h-5 text-gold flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-navy font-medium truncate">
                      {doc.title}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-navy/50 truncate">
                        {doc.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={doc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-navy/60 hover:text-gold transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => doc._id && handleDelete(doc._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete document"
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
