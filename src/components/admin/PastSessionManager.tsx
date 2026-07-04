"use client";

import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
  X,
  Pencil,
} from "lucide-react";
import type { PastSession, PastSessionAttachment } from "@/lib/types";

type Status = { type: "idle" | "success" | "error"; message?: string };

async function uploadImage(file: File): Promise<PastSessionAttachment> {
  const presign = await fetch("/api/past-sessions/upload", {
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
  if (!put.ok) throw new Error(`Upload failed for ${file.name}.`);

  return { url: publicUrl, key, filename: file.name };
}

export default function PastSessionManager() {
  const [list, setList] = useState<PastSession[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [editTarget, setEditTarget] = useState<PastSession | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingAttachments, setExistingAttachments] = useState<
    PastSessionAttachment[]
  >([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const isEditing = editTarget !== null;

  async function loadList() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/past-sessions");
      const data = await res.json();
      setList(data.pastSessions ?? []);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  function resetForm() {
    setEditTarget(null);
    setTitle("");
    setDescription("");
    setExistingAttachments([]);
    setPendingFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus({ type: "idle" });
  }

  function startEdit(item: PastSession) {
    setEditTarget(item);
    setTitle(item.title);
    setDescription(item.description);
    setExistingAttachments(item.attachments ?? []);
    setPendingFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus({ type: "idle" });
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const valid: File[] = [];
    const invalid: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        valid.push(file);
      } else {
        invalid.push(file.name);
      }
    });

    if (invalid.length > 0) {
      setStatus({
        type: "error",
        message: `Skipped non-image files: ${invalid.join(", ")}`,
      });
    } else {
      setStatus({ type: "idle" });
    }

    if (valid.length > 0) {
      setPendingFiles((prev) => [...prev, ...valid]);
    }
  }

  function removePendingFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingAttachment(index: number) {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle" });

    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required." });
      return;
    }
    if (!description.trim()) {
      setStatus({ type: "error", message: "Description is required." });
      return;
    }

    const totalImages = existingAttachments.length + pendingFiles.length;
    if (totalImages === 0) {
      setStatus({
        type: "error",
        message: "Please keep or add at least one image attachment.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const newAttachments: PastSessionAttachment[] = [];
      for (const file of pendingFiles) {
        newAttachments.push(await uploadImage(file));
      }

      const attachments = [...existingAttachments, ...newAttachments];

      if (isEditing && editTarget?._id) {
        const res = await fetch(`/api/past-sessions/${editTarget._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            attachments,
          }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || "Could not save changes.");
        }

        setStatus({ type: "success", message: "Past session updated." });
        await loadList();
        resetForm();
        return;
      }

      if (pendingFiles.length === 0) {
        setStatus({
          type: "error",
          message: "Please add at least one image attachment.",
        });
        return;
      }

      const create = await fetch("/api/past-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          attachments,
        }),
      });
      if (!create.ok) {
        const d = await create.json().catch(() => ({}));
        throw new Error(d.error || "Could not save past session.");
      }

      setStatus({ type: "success", message: "Past session published." });
      resetForm();
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
    if (!confirm("Delete this past session? This cannot be undone.")) return;
    if (editTarget?._id === id) resetForm();
    const res = await fetch(`/api/past-sessions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((item) => item._id !== id));
    } else {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          Past Sessions Admin
        </h1>
        <p className="text-sm text-navy/50">
          Add and manage past academic sessions
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 pb-12 space-y-8">
        <section
          ref={formTopRef}
          className={`rounded-2xl border bg-card p-6 sm:p-8 shadow-sm ${
            isEditing ? "border-gold/40" : "border-navy/10"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-navy">
                {isEditing ? "Edit Past Session" : "Add a Past Session"}
              </h2>
              <p className="mt-1 text-sm text-navy/55">
                {isEditing
                  ? `Editing: ${editTarget.title}`
                  : "Enter the session details and attach as many images as you need. They appear on the public page instantly."}
              </p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 text-sm text-navy/60 hover:text-navy transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                placeholder="e.g. Annual Academic Sessions 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition resize-y"
                placeholder="Brief summary of the session"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Image Attachments
              </label>

              {isEditing && existingAttachments.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-navy/50 mb-2">Current images</p>
                  <ul className="space-y-2">
                    {existingAttachments.map((attachment, index) => (
                      <li
                        key={`${attachment.url}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-navy/10 bg-surface px-3 py-2"
                      >
                        <div className="relative w-10 h-10 rounded overflow-hidden border border-navy/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={attachment.url}
                            alt={attachment.filename ?? `Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-navy/75 truncate flex-1">
                          {attachment.filename ?? `Image ${index + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExistingAttachment(index)}
                          className="p-1.5 rounded-md text-navy/45 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <label
                htmlFor="past-session-images"
                className="flex items-center gap-3 cursor-pointer rounded-lg border border-dashed border-navy/25 px-4 py-3 hover:border-gold transition-colors"
              >
                <ImagePlus className="w-5 h-5 text-navy/50" />
                <span className="text-sm text-navy/70">
                  {isEditing
                    ? "Add more images (JPEG, PNG, WebP, GIF)"
                    : "Choose one or more images (JPEG, PNG, WebP, GIF)"}
                </span>
              </label>
              <input
                id="past-session-images"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />

              {pendingFiles.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {pendingFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-navy/10 bg-surface px-3 py-2"
                    >
                      <span className="text-sm text-navy/75 truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePendingFile(index)}
                        className="p-1.5 rounded-md text-navy/45 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-navy/60 hover:text-gold transition-colors"
              >
                <ImagePlus className="w-4 h-4" />
                Add more images
              </button>
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

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-white font-semibold hover:bg-navy-light disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEditing ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {submitting
                  ? isEditing
                    ? "Saving…"
                    : "Publishing…"
                  : isEditing
                    ? "Save Changes"
                    : "Publish Session"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-lg border border-navy/20 px-6 py-2.5 text-navy/70 font-semibold hover:bg-navy/5 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy mb-4">
            Published Sessions
          </h2>

          {loadingList ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-navy/50 py-6">No past sessions yet.</p>
          ) : (
            <ul className="divide-y divide-navy/10">
              {list.map((item) => (
                <li
                  key={item._id}
                  className={`flex items-center gap-4 py-3.5 ${
                    editTarget?._id === item._id
                      ? "bg-gold/5 -mx-2 px-2 rounded-lg"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-navy font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-navy/50 mt-0.5">
                      {item.attachments.length} image
                      {item.attachments.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg text-navy/50 hover:text-gold hover:bg-gold/10 transition-colors"
                    aria-label="Edit past session"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => item._id && handleDelete(item._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete past session"
                    title="Delete"
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
