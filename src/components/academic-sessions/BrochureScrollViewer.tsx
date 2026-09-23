"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  AlertCircle,
  Download,
  ExternalLink,
  Loader2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Worker is copied into /public by scripts/copy-pdf-worker.mjs (pre dev/build).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 2.25;
const ZOOM_STEP = 0.15;

type BrochureScrollViewerProps = {
  url: string;
  title: string;
};

export default function BrochureScrollViewer({
  url,
  title,
}: BrochureScrollViewerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fitWidth, setFitWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);
  const [docReady, setDocReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function updateWidth() {
      // Small horizontal padding so pages breathe inside the frame.
      const pad = window.innerWidth < 640 ? 16 : 32;
      setFitWidth(Math.max(260, Math.floor(el!.clientWidth - pad)));
    }

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))),
    []
  );
  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2))),
    []
  );

  const pageWidth = fitWidth > 0 ? Math.round(fitWidth * zoom) : 0;
  const showPages = docReady && pageWidth > 0 && numPages > 0;
  const controlsDisabled = error || !docReady;

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-navy/10 bg-navy/[0.02] px-4 py-3 sm:px-5">
        <p className="text-sm text-navy/60 truncate min-w-0">{title}</p>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-navy/10 bg-white">
            <button
              type="button"
              onClick={zoomOut}
              disabled={controlsDisabled || zoom <= MIN_ZOOM}
              className="p-2 text-navy/70 transition-colors hover:bg-navy/[0.04] hover:text-navy disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] select-none text-center text-xs font-semibold tabular-nums text-navy/55">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={controlsDisabled || zoom >= MAX_ZOOM}
              className="p-2 text-navy/70 transition-colors hover:bg-navy/[0.04] hover:text-navy disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/[0.04] hover:text-gold"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative w-full overflow-auto overscroll-contain bg-navy/[0.03] h-[min(92vh,1100px)] min-h-[560px] sm:min-h-[720px]"
      >
        {error ? (
          <div className="flex h-full min-h-[560px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5">
              <AlertCircle className="h-6 w-6 text-navy/45" />
            </div>
            <div className="max-w-sm space-y-1.5">
              <p className="font-heading text-lg font-bold text-navy">
                Brochure could not be loaded
              </p>
              <p className="text-sm leading-relaxed text-navy/55">
                The document is temporarily unavailable in the browser viewer.
                You can still open or download it directly.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
              >
                <Download className="h-4 w-4" />
                Download brochure
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/40"
              >
                <ExternalLink className="h-4 w-4" />
                Open in new tab
              </a>
            </div>
          </div>
        ) : (
          <>
            {!showPages && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-navy/50">
                <Loader2 className="h-7 w-7 animate-spin" />
                <span className="text-sm">Loading brochure…</span>
              </div>
            )}
            <Document
              file={url}
              loading={null}
              onLoadSuccess={({ numPages: n }) => {
                setNumPages(n);
                setDocReady(true);
                setError(false);
              }}
              onLoadError={() => {
                setError(true);
                setDocReady(false);
              }}
              onSourceError={() => {
                setError(true);
                setDocReady(false);
              }}
              className="flex flex-col items-center gap-3 sm:gap-4 px-2 py-3 sm:px-4 sm:py-5"
            >
              {showPages &&
                Array.from({ length: numPages }, (_, i) => (
                  <div
                    key={`page-${i + 1}`}
                    className="overflow-hidden rounded-sm bg-white shadow-md shadow-navy/10 ring-1 ring-navy/5"
                  >
                    <Page
                      pageNumber={i + 1}
                      width={pageWidth}
                      renderTextLayer
                      renderAnnotationLayer={false}
                      loading={
                        <div
                          className="bg-white"
                          style={{
                            width: pageWidth,
                            height: pageWidth * 1.414,
                          }}
                        />
                      }
                    />
                  </div>
                ))}
            </Document>
          </>
        )}
      </div>
    </div>
  );
}
