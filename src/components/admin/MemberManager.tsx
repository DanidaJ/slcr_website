"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck,
  ShieldOff,
  ClipboardList,
  Check,
  X,
} from "lucide-react";
import type { Member } from "@/lib/types";

type Status = { type: "idle" | "success" | "error"; message?: string };

export default function MemberManager() {
  const [list, setList] = useState<Member[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memberNumber, setMemberNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function loadList() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/members");
      const data = await res.json();
      setList(data.members ?? []);
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
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, memberNumber: memberNumber || undefined }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Could not create member.");
      }
      setStatus({
        type: "success",
        message: `${email} can now sign in with Google.`,
      });
      setName("");
      setEmail("");
      setMemberNumber("");
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

  async function toggleStatus(member: Member) {
    // pending → active (approve), active → suspended, suspended → active
    const next = member.status === "active" ? "suspended" : "active";
    const res = await fetch(`/api/admin/members/${member._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setList((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, status: next } : m))
      );
    } else {
      alert("Failed to update member.");
    }
  }

  async function handleDelete(id: string, email: string) {
    if (
      !confirm(
        `Remove ${email}? They will immediately lose access. This cannot be undone.`
      )
    )
      return;
    const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((m) => m._id !== id));
    } else {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6">
        <h1 className="font-heading text-2xl font-extrabold text-navy">Member Admin</h1>
        <p className="text-sm text-navy/50">Manage member accounts and applications</p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 pb-12 space-y-8">
        {/* Create form */}
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy">
            Authorize a Member
          </h2>
          <p className="mt-1 text-sm text-navy/55">
            Add the email of the member&apos;s Google account. They can then sign
            in with &ldquo;Continue with Google&rdquo; using that same email.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-1.5">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                  placeholder="Dr. Jane Perera"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-1.5">
                  Google Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="sm:max-w-xs">
              <label className="block text-sm font-medium text-navy/70 mb-1.5">
                Member Number <span className="text-navy/40">(optional)</span>
              </label>
              <input
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                placeholder="SLCR-0042"
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
              disabled={submitting || !name || !email}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-white font-semibold hover:bg-navy-light disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {submitting ? "Adding…" : "Add Member"}
            </button>
          </form>
        </section>

        {/* Pending applications */}
        {(() => {
          const pending = list.filter((m) => m.status === "pending");
          return (
            <section className="rounded-2xl border border-amber-200 bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-amber-500" />
                <h2 className="font-heading text-xl font-extrabold text-navy">
                  Pending Applications
                </h2>
                {pending.length > 0 && (
                  <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                    {pending.length}
                  </span>
                )}
              </div>

              {loadingList ? (
                <div className="flex items-center gap-2 text-navy/50 text-sm py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading…
                </div>
              ) : pending.length === 0 ? (
                <p className="text-sm text-navy/50 py-4">No pending applications.</p>
              ) : (
                <ul className="divide-y divide-navy/10">
                  {pending.map((m) => (
                    <li key={m._id} className="py-4">
                      <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-navy font-semibold">{m.name}</p>
                          <p className="text-xs text-navy/50">{m.email}</p>
                          {m.registration && (
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-navy/60">
                              {m.registration.mobile && (
                                <span>📱 {m.registration.mobile}</span>
                              )}
                              {m.registration.post && (
                                <span>🏥 {m.registration.post}</span>
                              )}
                              {m.registration.hospital && (
                                <span>🏢 {m.registration.hospital}</span>
                              )}
                              {m.registration.province && (
                                <span>📍 {m.registration.province}</span>
                              )}
                              {m.registration.nic && (
                                <span>🪪 {m.registration.nic}</span>
                              )}
                              {m.username && (
                                <span>👤 @{m.username}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleStatus(m)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => m._id && handleDelete(m._id, m.email)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })()}

        {/* Active / suspended members */}
        <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-extrabold text-navy mb-4">
            Members
          </h2>

          {loadingList ? (
            <div className="flex items-center gap-2 text-navy/50 text-sm py-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : (
            (() => {
              const members = list.filter((m) => m.status !== "pending");
              return members.length === 0 ? (
                <p className="text-sm text-navy/50 py-6">No approved members yet.</p>
              ) : (
                <ul className="divide-y divide-navy/10">
                  {members.map((m) => (
                    <li key={m._id} className="flex items-center gap-4 py-3.5">
                      <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-navy font-medium truncate">
                          {m.name}
                          {m.memberNumber && (
                            <span className="text-navy/40 font-normal">
                              {" "}· {m.memberNumber}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-navy/50 truncate">{m.email}</p>
                      </div>

                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          m.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {m.status === "active" ? "Active" : "Suspended"}
                      </span>

                      <button
                        onClick={() => toggleStatus(m)}
                        className="p-2 rounded-lg text-navy/60 hover:bg-navy/5 transition-colors"
                        aria-label={
                          m.status === "active" ? "Suspend member" : "Reactivate member"
                        }
                        title={m.status === "active" ? "Suspend" : "Reactivate"}
                      >
                        {m.status === "active" ? (
                          <ShieldOff className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => m._id && handleDelete(m._id, m.email)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Delete member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              );
            })()
          )}
        </section>
      </div>
    </div>
  );
}
