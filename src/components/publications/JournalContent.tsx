"use client";

import { motion } from "framer-motion";
import { BookOpen, Globe } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "-60px" } as const;

const JOURNAL_URL = "https://sljr.sljol.info/";

export default function JournalContent() {
  return (
    <motion.section
      variants={fadeUp()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="max-w-4xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-3xl border border-navy/10 bg-navy shadow-xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-500/[0.06] blur-3xl pointer-events-none" />
        <div className="h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold" />

        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Visual */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="relative w-full max-w-[200px] aspect-[4/5] rounded-2xl bg-gradient-to-br from-navy-light/40 to-navy-dark ring-1 ring-white/10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/15 ring-1 ring-gold/30 flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-gold" />
              </div>
              <p className="font-heading text-xl font-extrabold text-white leading-tight">
                SLJR
              </p>
              <p className="mt-1.5 text-[11px] text-white/55 tracking-wide">
                Sri Lanka Journal of Radiology
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] text-[11px] font-medium text-white/70">
                <Globe className="w-3 h-3 text-gold" />
                Open Access
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-2">
              Official Journal
            </p>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Sri Lanka Journal of Radiology
            </h2>
            <div className="mt-3 w-12 h-0.5 bg-gold" />
            <p className="mt-4 text-white/70 text-sm sm:text-[15px] leading-relaxed">
              The Sri Lanka Journal of Radiology (SLJR) is a peer-reviewed,
              open-access, online journal published by the Sri Lanka College of
              Radiologists. It aims to promote scientific writing and local
              research in radiology and allied disciplines by creating a platform
              for publication.
            </p>

            <div className="mt-6">
              <a
                href={JOURNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:bg-gold-light transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Visit Journal
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
