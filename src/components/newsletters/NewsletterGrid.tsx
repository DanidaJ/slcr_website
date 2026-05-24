"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import type { Newsletter } from "@/lib/types";
import NewsletterCard from "./NewsletterCard";

// PDF viewer pulls in pdfjs — load it only in the browser, on demand.
const PdfViewerModal = dynamic(() => import("./PdfViewerModal"), { ssr: false });

export default function NewsletterGrid({
  newsletters,
}: {
  newsletters: Newsletter[];
}) {
  const [active, setActive] = useState<Newsletter | null>(null);

  if (newsletters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-surface py-20 text-center">
        <FileText className="w-10 h-10 text-navy/30" />
        <p className="mt-4 text-navy/60 font-medium">
          No newsletters published yet.
        </p>
        <p className="mt-1 text-sm text-navy/45">
          Check back soon for the latest issues of Radiology News.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newsletters.map((n, i) => (
          <NewsletterCard
            key={n._id}
            newsletter={n}
            index={i}
            onRead={setActive}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <PdfViewerModal
            url={active.pdfUrl}
            title={active.title}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
