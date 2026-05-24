"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Loader2,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Worker is copied into /public by scripts/copy-pdf-worker.mjs (pre dev/build),
// so it's served from a stable, version-matched URL — no CDN dependency.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type PdfViewerModalProps = {
  url: string;
  title: string;
  onClose: () => void;
};

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.4;
const SCALE_STEP = 0.2;

export default function PdfViewerModal({
  url,
  title,
  onClose,
}: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(false);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setPageNumber((p) => Math.max(1, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setPageNumber((p) => Math.min(numPages || p, p + 1));
  }, [numPages]);

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2))),
    []
  );
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2))),
    []
  );

  // Keyboard controls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, zoomIn, zoomOut, onClose]);

  // Reset scroll to top of page on page change.
  useEffect(() => {
    pageWrapRef.current?.scrollTo({ top: 0 });
  }, [pageNumber]);

  if (!mounted) return null;

  const overlay = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col bg-navy-dark/95 backdrop-blur-sm"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-navy-dark/80">
        <h3 className="text-white text-sm sm:text-base font-semibold truncate max-w-[40%]">
          {title}
        </h3>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Page nav */}
          <div className="hidden sm:flex items-center gap-1 mr-2 text-white/70 text-sm tabular-nums">
            <button
              onClick={goPrev}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="min-w-[64px] text-center">
              {pageNumber} / {numPages || "—"}
            </span>
            <button
              onClick={goNext}
              disabled={!!numPages && pageNumber >= numPages}
              className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom */}
          <button
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="hidden sm:inline text-white/60 text-xs tabular-nums w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Download */}
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
            aria-label="Download PDF"
          >
            <Download className="w-5 h-5" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors ml-1"
            aria-label="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document area */}
      <div
        ref={pageWrapRef}
        className="relative flex-1 overflow-auto overscroll-contain flex items-start justify-center py-6 px-3 sm:px-6"
      >
        {error ? (
          <div className="m-auto text-center text-white/70">
            <p className="text-sm">This PDF could not be displayed.</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Download instead
            </a>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            onLoadError={() => setError(true)}
            loading={
              <div className="m-auto flex flex-col items-center gap-3 text-white/60 pt-20">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="text-sm">Loading document…</span>
              </div>
            }
            className="flex justify-center"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={pageNumber}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="shadow-2xl shadow-black/50"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </motion.div>
            </AnimatePresence>
          </Document>
        )}
      </div>

      {/* Mobile page nav (bottom bar) */}
      {!error && (
        <div className="sm:hidden flex items-center justify-center gap-4 py-3 border-t border-white/10 bg-navy-dark/80 text-white/80 text-sm tabular-nums">
          <button
            onClick={goPrev}
            disabled={pageNumber <= 1}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="min-w-[64px] text-center">
            {pageNumber} / {numPages || "—"}
          </span>
          <button
            onClick={goNext}
            disabled={!!numPages && pageNumber >= numPages}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
  );

  return createPortal(overlay, document.body);
}
