"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BookOpen, Download, FileText } from "lucide-react";
import type { Newsletter } from "@/lib/types";

const PdfThumbnail = dynamic(() => import("./PdfThumbnail"), { ssr: false });

type NewsletterCardProps = {
  newsletter: Newsletter;
  index: number;
  onRead: (n: Newsletter) => void;
};

function metaLine(n: Newsletter): string {
  const parts: string[] = [];
  if (n.volume) parts.push(`Vol ${n.volume}`);
  if (n.issue) parts.push(`Issue ${n.issue}`);
  return parts.join(" · ");
}

function dateLine(n: Newsletter): string {
  if (n.month) return `${n.month} ${n.year}`;
  return String(n.year);
}

export default function NewsletterCard({
  newsletter,
  index,
  onRead,
}: NewsletterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-card shadow-sm hover:shadow-xl hover:shadow-navy/10 transition-shadow"
    >
      {/* Magazine-style cover */}
      <button
        onClick={() => onRead(newsletter)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy-dark text-left"
        aria-label={`Read ${newsletter.title}`}
      >
        {/* PDF first-page ghost */}
        <PdfThumbnail url={newsletter.pdfUrl} />

        {/* Bottom-up gradient so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/70 to-navy/20 pointer-events-none" />

        {/* Decorative gold orb top-right */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

        {/* Gold left accent bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gold/80 pointer-events-none" />

        {/* Content — pushed to bottom where gradient is darkest */}
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
          {/* Top-left icon */}
          <div className="absolute top-5 left-6">
            <FileText className="w-6 h-6 text-gold/80" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
              Radiology News
            </p>
            <h3 className="mt-1 font-heading text-lg font-extrabold leading-snug text-white line-clamp-2">
              {newsletter.title}
            </h3>
            {metaLine(newsletter) && (
              <p className="mt-2 text-xs font-medium text-gold/90">
                {metaLine(newsletter)}
              </p>
            )}
            <p className="mt-0.5 text-sm text-white/70">{dateLine(newsletter)}</p>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-navy-dark/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold text-navy text-sm font-bold shadow-lg">
            <BookOpen className="w-4 h-4" />
            Read Online
          </span>
        </div>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4">
        <button
          onClick={() => onRead(newsletter)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Read
        </button>
        <a
          href={newsletter.pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-navy/15 text-navy text-sm font-semibold hover:border-navy/40 hover:bg-surface transition-colors"
          aria-label={`Download ${newsletter.title}`}
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
