"use client";

import { useState } from "react";
import {
  Send,
  Paperclip,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { Correspondence } from "@/lib/types";

const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp";

type Status = { type: "idle" | "success" | "error"; message?: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CorrespondenceForm({
  sent,
}: {
  sent: Correspondence[];
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [history, setHistory] = useState<Correspondence[]>(sent);

  const inputCls =
    "w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle" });
    setSending(true);

    try {
      let fileMeta: { fileUrl?: string; fileKey?: string; fileName?: string } = {};

      if (file) {
        const presign = await fetch("/api/member/correspondence/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const pd = await presign.json().catch(() => ({}));
        if (!presign.ok) throw new Error(pd.error || "Could not start upload.");

        const put = await fetch(pd.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!put.ok) throw new Error("Upload to storage failed.");

        fileMeta = { fileUrl: pd.publicUrl, fileKey: pd.key, fileName: file.name };
      }

      const res = await fetch("/api/member/correspondence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, ...fileMeta }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not send message.");

      setStatus({ type: "success", message: "Message sent to the admin team." });
      setHistory((prev) => [d.item, ...prev]);
      setSubject("");
      setMessage("");
      setFile(null);
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Compose */}
      <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Send className="h-5 w-5 text-navy" />
          <h2 className="font-heading text-xl font-extrabold text-navy">
            Send a message
          </h2>
        </div>
        <p className="text-sm text-navy/55 mb-6">
          Your message will be delivered to the admin team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy/70">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className={inputCls}
              placeholder="e.g. Query about membership renewal"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy/70">
              Message{" "}
              <span className="text-navy/40">(optional if a file is attached)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={`${inputCls} resize-y`}
              placeholder="Write your message…"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy/70">
              Attachment <span className="text-navy/40">(optional)</span>
            </label>
            {file ? (
              <div className="flex items-center justify-between rounded-lg border border-navy/15 px-4 py-2.5">
                <span className="flex items-center gap-2 truncate text-sm text-navy">
                  <Paperclip className="h-4 w-4 flex-shrink-0 text-navy/50" />
                  <span className="truncate">{file.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-navy/40 hover:text-red-500"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-navy/20 px-4 py-2.5 text-sm text-navy/55 transition hover:border-gold/50">
                <Paperclip className="h-4 w-4" />
                Choose a file (PDF, PNG, JPEG, WebP)
                <input
                  type="file"
                  accept={ACCEPT}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          {status.type !== "idle" && (
            <div
              className={`flex items-center gap-2 text-sm ${
                status.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={sending || !subject || (!message && !file)}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>

      {/* Sent history */}
      {history.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-lg font-bold text-navy">
            Previously sent
          </h2>
          <ul className="space-y-3">
            {history.map((item) => (
              <li
                key={item._id}
                className="rounded-2xl border border-navy/10 bg-card px-5 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy truncate">{item.subject}</p>
                    {item.body && (
                      <p className="mt-1 text-sm text-navy/60 line-clamp-2">
                        {item.body}
                      </p>
                    )}
                    {item.fileName && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-navy/50">
                        <Paperclip className="h-3 w-3" />
                        {item.fileName}
                      </p>
                    )}
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1 text-xs text-navy/40 whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.sentAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
