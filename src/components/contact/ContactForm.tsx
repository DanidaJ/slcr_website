"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = { type: "idle" | "success" | "error"; message?: string };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const canSubmit =
    name.trim() && email.trim() && subject.trim() && message.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle" });
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send message.");
      setStatus({
        type: "success",
        message: "Message sent! We'll get back to you shortly.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-navy">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-navy">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter your subject"
          className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here"
          className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
        />
      </div>

      {status.type !== "idle" && (
        <div
          className={`flex items-start gap-2 text-sm rounded-lg px-4 py-3 ${
            status.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !canSubmit}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
