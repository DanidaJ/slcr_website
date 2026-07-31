"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Puzzle, X, LoaderCircle } from "lucide-react";

// Keeps the board, timer and leaderboard out of the homepage bundle until asked for.
const XrayPuzzleGame = dynamic(() => import("./XrayPuzzleGame"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-2 py-20 text-sm text-navy/45">
      <LoaderCircle className="h-4 w-4 animate-spin" />
      Loading puzzle…
    </div>
  ),
});

/** `createPortal` has no server equivalent, so the portal waits for the client. */
const noopSubscribe = () => () => {};

export default function XrayGameFloat() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Escape to close, and hold the page still behind the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Sits beside BackToTop, clear of the Quick Links panel and its popover. */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Play the chest X-ray puzzle"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.6 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="group fixed bottom-5 right-20 sm:bottom-8 sm:right-24 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-navy text-gold shadow-lg shadow-navy-dark/40 transition-colors hover:bg-navy-light sm:h-12 sm:w-12"
      >
        <Puzzle className="h-5 w-5" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-navy px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block">
          X-ray Puzzle
        </span>
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-dark/60 px-4 py-6 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="xray-game-title"
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-2xl shadow-navy-dark/40"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <h2
                        id="xray-game-title"
                        className="font-heading text-base font-bold text-navy sm:text-lg"
                      >
                        🩻 Chest X-Ray Puzzle
                      </h2>
                      <p className="mt-0.5 text-xs text-navy/55 sm:text-sm">
                        Rebuild the X-ray as fast as you can.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close puzzle"
                      className="-mr-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    <XrayPuzzleGame />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
