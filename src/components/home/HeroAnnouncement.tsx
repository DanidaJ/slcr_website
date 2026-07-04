"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone } from "lucide-react";

type HeroAnnouncementProps = {
  message: string;
};

export default function HeroAnnouncement({ message }: HeroAnnouncementProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mt-5 flex w-full justify-center px-2">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={`flex items-center ${
          expanded
            ? "max-w-2xl gap-3 rounded-2xl border-2 border-gold/80 bg-linear-to-r from-gold/25 via-gold/15 to-gold/25 px-4 py-3.5 shadow-[0_0_32px_rgba(212,175,55,0.35)] backdrop-blur-md"
            : "justify-center"
        }`}
      >
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? "Collapse announcement"
              : "Expand announcement"
          }
          className={`group relative flex shrink-0 items-center justify-center rounded-full border border-gold/60 bg-gold/20 text-gold transition-colors hover:bg-gold/30 hover:border-gold cursor-pointer ${
            expanded ? "h-10 w-10" : "h-11 w-11"
          }`}
        >
          {!expanded && (
            <span className="absolute inset-0 rounded-full bg-gold/25 animate-ping opacity-50" />
          )}
          <Megaphone className="relative h-5 w-5" aria-hidden="true" />
        </button>

        <AnimatePresence initial={false} mode="popLayout">
          {expanded && (
            <motion.p
              key="message"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-w-0 text-left text-sm sm:text-base font-semibold leading-relaxed text-white drop-shadow-sm whitespace-pre-wrap"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
