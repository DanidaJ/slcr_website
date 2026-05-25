"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, BookOpen } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import type { FellowshipDocument } from "@/lib/types";

const PdfViewerModal = dynamic(
  () => import("@/components/newsletters/PdfViewerModal"),
  { ssr: false }
);

const VIEWPORT = { once: true, margin: "-60px" } as const;

type FellowshipContentProps = {
  documents: FellowshipDocument[];
};

export default function FellowshipContent({
  documents,
}: FellowshipContentProps) {
  const [activeDoc, setActiveDoc] = useState<FellowshipDocument | null>(null);

  return (
    <article className="space-y-10">
      <motion.div
        variants={fadeUp()}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
          Fellowship of Sri Lanka College of Radiologists (FSLCR)
        </h2>
        <div className="mt-1.5 w-12 h-0.5 bg-gold" />
      </motion.div>

      <motion.div
        variants={fadeUp(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="space-y-4 text-navy/80 text-[15px] sm:text-base leading-relaxed"
      >
        <p>
          The Sri Lanka College of Radiologists calls for nomination for the
          award of &ldquo;Fellowship of Sri Lanka College of Radiologists&rdquo;
          (FSLCR).
        </p>
        <p>
          Nominees fulfilling the criteria will be awarded FSLCR at the
          Inauguration ceremony of Annual Academic Sessions to be held on 25th
          of October, 2024.
        </p>
        <p>
          Members are kindly requested to submit the nominations on or before
          31st of May 2024.
        </p>
        <p>
          The application form for nomination with the point chart and
          guidelines for nomination are attached herewith.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-5 sm:p-6"
      >
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-2">
          Important Notice
        </p>
        <p className="text-navy/80 text-[15px] sm:text-base leading-relaxed">
          Please note that your payment can be done to{" "}
          <span className="font-semibold text-navy">Commercial Bank</span>,
          Ward Place branch, Account number{" "}
          <span className="font-semibold text-navy">8145003002</span> and send
          the payment slip to college WhatsApp number{" "}
          <span className="font-semibold text-navy">0779933906</span>.
        </p>
      </motion.div>

      {documents.length > 0 && (
        <motion.div
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <h3 className="font-heading text-lg sm:text-xl font-bold text-navy mb-4">
            Downloadable Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="group rounded-2xl border border-navy/10 bg-surface overflow-hidden hover:border-navy/25 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-navy/[0.07] flex items-center justify-center text-navy/60">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm sm:text-base font-bold text-navy">
                      {doc.title}
                    </p>
                    {doc.description && (
                      <p className="text-navy/50 text-xs sm:text-sm mt-0.5">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-5 pb-4">
                  <button
                    onClick={() => setActiveDoc(doc)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read
                  </button>
                  <a
                    href={doc.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-navy/15 text-navy text-sm font-semibold hover:border-navy/40 hover:bg-white transition-colors"
                    aria-label={`Download ${doc.title}`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        variants={fadeUp(0.25)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="rounded-2xl border border-navy/10 bg-surface p-5 sm:p-6"
      >
        <p className="text-navy/80 text-[15px] sm:text-base leading-relaxed">
          Thank you,
        </p>
        <div className="mt-3">
          <p className="font-heading font-bold text-navy">Dr. Asanka Perera</p>
          <p className="text-navy/60 text-sm">Hon. Secretary</p>
          <p className="text-navy/60 text-sm">
            Sri Lanka College of Radiologists
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {activeDoc && (
          <PdfViewerModal
            url={activeDoc.pdfUrl}
            title={activeDoc.title}
            onClose={() => setActiveDoc(null)}
          />
        )}
      </AnimatePresence>
    </article>
  );
}
