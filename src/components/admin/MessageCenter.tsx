"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  X,
} from "lucide-react";
import type { Member } from "@/lib/types";

type Status = { type: "idle" | "success" | "error"; message?: string };

const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp";

export default function MessageCenter() {
  const [members, setMembers] = useState<Member[]>([]);

  // Broadcast composer
  const [bSubject, setBSubject] = useState("");
  const [bMessage, setBMessage] = useState("");
  const [bSending, setBSending] = useState(false);
  const [bStatus, setBStatus] = useState<Status>({ type: "idle" });

  // Direct message composer
  const [memberId, setMemberId] = useState("");
  const [dSubject, setDSubject] = useState("");
  const [dMessage, setDMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dSending, setDSending] = useState(false);
  const [dStatus, setDStatus] = useState<Status>({ type: "idle" });

  useEffect(() => {
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((d) =>
        setMembers(
          (d.members ?? []).filter((m: Member) => m.status === "active")
        )
      )
      .catch(() => setMembers([]));
  }, []);

  async function sendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    setBStatus({ type: "idle" });
    setBSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: bSubject, message: bMessage }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not send broadcast.");
      setBStatus({
        type: "success",
        message: `Sent to ${d.recipientCount} member${
          d.recipientCount === 1 ? "" : "s"
        }.`,
      });
      setBSubject("");
      setBMessage("");
    } catch (err) {
      setBStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setBSending(false);
    }
  }

  async function sendDirect(e: React.FormEvent) {
    e.preventDefault();
    setDStatus({ type: "idle" });
    setDSending(true);
    try {
      let fileMeta: { fileUrl?: string; fileKey?: string; fileName?: string } = {};

      // 1. If a file is attached, presign + upload it straight to R2 first.
      if (file) {
        const presign = await fetch("/api/admin/messages/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId,
            filename: file.name,
            contentType: file.type,
          }),
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

      // 2. Record the delivery (this also fires the email notification).
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          subject: dSubject,
          message: dMessage,
          ...fileMeta,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not send message.");

      setDStatus({ type: "success", message: "Message delivered." });
      setDSubject("");
      setDMessage("");
      setFile(null);
    } catch (err) {
      setDStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setDSending(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition";

  return (
    <div className="min-h-screen bg-surface pt-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <h1 className="font-heading text-2xl font-extrabold text-navy">
          Messages
        </h1>
        <p className="text-sm text-navy/50">
          Broadcast announcements to all members, or send a direct message and
          files to one member.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-16 space-y-8">
        {/* Broadcast */}
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-gold-dark" />
            <h2 className="font-heading text-xl font-extrabold text-navy">
              Broadcast to all members
            </h2>
          </div>
          <p className="mt-1 text-sm text-navy/55">
            Text-only announcement delivered to every active member&apos;s inbox
            (and emailed to them).
          </p>

          <form onSubmit={sendBroadcast} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy/70">
                Subject
              </label>
              <input
                value={bSubject}
                onChange={(e) => setBSubject(e.target.value)}
                required
                className={inputCls}
                placeholder="Annual General Meeting — 12 July"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy/70">
                Message
              </label>
              <textarea
                value={bMessage}
                onChange={(e) => setBMessage(e.target.value)}
                required
                rows={5}
                className={`${inputCls} resize-y`}
                placeholder="Write your announcement…"
              />
            </div>

            {bStatus.type !== "idle" && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  bStatus.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {bStatus.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {bStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={bSending || !bSubject || !bMessage}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
            >
              {bSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Megaphone className="h-4 w-4" />
              )}
              {bSending ? "Sending…" : "Send broadcast"}
            </button>
          </form>
        </section>

        {/* Direct message */}
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-navy" />
            <h2 className="font-heading text-xl font-extrabold text-navy">
              Message a member
            </h2>
          </div>
          <p className="mt-1 text-sm text-navy/55">
            Send a private message and optionally attach a file (e.g. a
            certificate) to a single member.
          </p>

          <form onSubmit={sendDirect} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy/70">
                Recipient
              </label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className={inputCls}
              >
                <option value="">Select a member…</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy/70">
                Subject
              </label>
              <input
                value={dSubject}
                onChange={(e) => setDSubject(e.target.value)}
                required
                className={inputCls}
                placeholder="Your CPD certificate"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy/70">
                Message <span className="text-navy/40">(optional if a file is attached)</span>
              </label>
              <textarea
                value={dMessage}
                onChange={(e) => setDMessage(e.target.value)}
                rows={4}
                className={`${inputCls} resize-y`}
                placeholder="Add a note…"
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

            {dStatus.type !== "idle" && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  dStatus.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {dStatus.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {dStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={dSending || !memberId || !dSubject || (!dMessage && !file)}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
            >
              {dSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {dSending ? "Sending…" : "Send message"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
