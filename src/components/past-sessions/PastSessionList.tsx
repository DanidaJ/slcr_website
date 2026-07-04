"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { PastSession } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import PastSessionGallery from "./PastSessionGallery";

const VIEWPORT = { once: true, margin: "-40px" } as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PastSessionListProps = {
  sessions: PastSession[];
};

export default function PastSessionList({ sessions }: PastSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-surface px-6 py-16 text-center">
        <p className="text-navy/50 text-sm sm:text-base">
          No past sessions have been published yet. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {sessions.map((session, index) => (
        <motion.article
          key={session._id ?? session.title}
          variants={fadeUp(index * 0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="rounded-2xl border border-navy/10 bg-white p-6 sm:p-8 shadow-sm"
        >
          <p className="text-xs text-navy/45 flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(session.publishedAt)}
          </p>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
            {session.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-navy/65 leading-relaxed whitespace-pre-line">
            {session.description}
          </p>

          {session.attachments.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/45 mb-3">
                Gallery
              </p>
              <PastSessionGallery
                attachments={session.attachments}
                title={session.title}
              />
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );
}
