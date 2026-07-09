"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import NewsEventImage from "./NewsEventImage";

type Props = {
  src: string;
  alt: string;
};

export default function NewsEventLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Image with expand button */}
      <div
        className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-navy/10 shadow-sm group cursor-zoom-in bg-navy/5"
        onClick={() => setOpen(true)}
      >
        <NewsEventImage
          src={src}
          alt={alt}
          fill
          letterbox
          className="transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="100vw"
          priority
        />
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          aria-label="Expand image"
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 text-xs font-semibold backdrop-blur-sm transition-colors shadow-md"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Expand
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
            onClick={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-6xl max-h-[90vh] aspect-[16/9]"
              onClick={(e) => e.stopPropagation()}
            >
              <NewsEventImage
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
