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

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 2.4;
const ZOOM_STEP = 0.15;

function horizontalInset(viewportWidth: number) {
  // Leave room for side nav arrows without clipping the page.
  return viewportWidth < 640 ? 56 : viewportWidth < 1024 ? 120 : 160;
}

export default function PdfViewerModal({
  url,
  title,
  onClose,
}: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [fitWidth, setFitWidth] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Fit each page to the available viewer width (mobile-first).
  useEffect(() => {
    const el = pageWrapRef.current;
    if (!el) return;

    function updateFitWidth() {
      const inset = horizontalInset(window.innerWidth);
      setFitWidth(Math.max(240, el!.clientWidth - inset));
    }

    updateFitWidth();
    const ro = new ResizeObserver(updateFitWidth);
    ro.observe(el);
    window.addEventListener("resize", updateFitWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateFitWidth);
    };
  }, []);

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
    () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2))),
    []
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))),
    []
  );

  const pageWidth = fitWidth ? Math.round(fitWidth * zoom) : undefined;

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
            disabled={zoom <= MIN_ZOOM}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="hidden sm:inline text-white/60 text-xs tabular-nums w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
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
        className="relative flex-1 overflow-auto overscroll-contain flex items-start justify-center py-4 sm:py-6 px-2 sm:px-6"
      >
        {!error && numPages > 0 && (
          <>
            <button
              onClick={goPrev}
              disabled={pageNumber <= 1}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-14 sm:w-14 sm:h-24 rounded-lg sm:rounded-xl bg-navy/35 sm:bg-navy/50 hover:bg-navy/70 active:bg-navy/80 text-white/60 hover:text-white sm:text-white/70 disabled:opacity-20 disabled:hover:bg-navy/35 transition-all backdrop-blur-sm border border-white/5 sm:border-white/10 touch-manipulation"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={2.5} />
            </button>
            <button
              onClick={goNext}
              disabled={pageNumber >= numPages}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-14 sm:w-14 sm:h-24 rounded-lg sm:rounded-xl bg-navy/35 sm:bg-navy/50 hover:bg-navy/70 active:bg-navy/80 text-white/60 hover:text-white sm:text-white/70 disabled:opacity-20 disabled:hover:bg-navy/35 transition-all backdrop-blur-sm border border-white/5 sm:border-white/10 touch-manipulation"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={2.5} />
            </button>
          </>
        )}

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
                  width={pageWidth}
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
