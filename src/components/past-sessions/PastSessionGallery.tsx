"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import NewsEventImage from "@/components/news-events/NewsEventImage";
import type { PastSessionAttachment } from "@/lib/types";

type Props = {
  attachments: PastSessionAttachment[];
  title: string;
};

function imageAlt(
  attachment: PastSessionAttachment,
  title: string,
  index: number
) {
  return attachment.filename
    ? `${title} — ${attachment.filename}`
    : `${title} — image ${index + 1}`;
}

export default function PastSessionGallery({ attachments, title }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = attachments.length;
  const active = attachments[activeIndex];

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + count) % count);
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % count);
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, count]);

  useEffect(() => {
    if (!open) return;
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, open]);

  function openAt(index: number) {
    setActiveIndex(index);
    setOpen(true);
  }

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function goPrev(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((i) => (i - 1 + count) % count);
  }

  function goNext(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((i) => (i + 1) % count);
  }

  if (count === 0) return null;

  return (
    <>
      <div
        className={
          count === 1
            ? "grid grid-cols-1"
            : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        }
      >
        {attachments.map((attachment, index) => (
          <button
            key={`${attachment.url}-${index}`}
            type="button"
            onClick={() => openAt(index)}
            className={`group relative overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm hover:shadow-md transition-shadow cursor-zoom-in ${
              count === 1 ? "aspect-[16/9]" : "aspect-[4/3]"
            }`}
          >
            <NewsEventImage
              src={attachment.url}
              alt={imageAlt(attachment, title, index)}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes={
                count === 1
                  ? "(max-width: 768px) 100vw, 960px"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              }
            />
            <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/55 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3 h-3" />
              View
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/92"
            onClick={() => setOpen(false)}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0">
              <div className="min-w-0 pr-4">
                <p className="text-white font-heading font-semibold text-sm sm:text-base truncate">
                  {title}
                </p>
                {count > 1 && (
                  <p className="text-white/50 text-xs mt-0.5">
                    {activeIndex + 1} of {count}
                  </p>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 min-h-0 flex items-center justify-center px-14 sm:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              {count > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-2 sm:left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors border border-white/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-2 sm:right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors border border-white/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <motion.div
                key={active.url}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.url}
                  alt={imageAlt(active, title, activeIndex)}
                  className="max-h-[50vh] sm:max-h-[58vh] max-w-full w-auto h-auto object-contain mx-auto block"
                />
              </motion.div>
            </div>

            {count > 1 && (
              <div
                className="shrink-0 border-t border-white/10 bg-black/40 px-4 sm:px-6 py-3 sm:py-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center">
                  <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 max-w-full">
                  {attachments.map((attachment, index) => (
                    <button
                      key={`thumb-${attachment.url}-${index}`}
                      ref={(el) => {
                        thumbRefs.current[index] = el;
                      }}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === activeIndex
                          ? "border-gold ring-2 ring-gold/40 opacity-100 scale-105"
                          : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/40"
                      }`}
                    >
                      <NewsEventImage
                        src={attachment.url}
                        alt={imageAlt(attachment, title, index)}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
