"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import {
  MEMBERSHIP_DESCRIPTION_SECTIONS,
  type MembershipSubsection,
} from "@/lib/data/membershipDescription";

const VIEWPORT = { once: true, margin: "-60px" } as const;

function SubsectionBlock({ subsection }: { subsection: MembershipSubsection }) {
  return (
    <div className="space-y-3">
      <h3 className="font-heading text-base sm:text-lg font-bold text-navy">
        {subsection.title}
      </h3>

      {subsection.intro && (
        <p className="text-navy/70 text-[15px] sm:text-base leading-relaxed">
          {subsection.intro}
        </p>
      )}

      {subsection.paragraphs?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="text-navy/70 text-[15px] sm:text-base leading-relaxed"
        >
          {paragraph}
        </p>
      ))}

      {subsection.items && (
        <ol className="space-y-3 list-none">
          {subsection.items.map((item) => (
            <li
              key={`${subsection.title}-${item.label}`}
              className="flex gap-3 text-navy/70 text-[15px] sm:text-base leading-relaxed"
            >
              <span className="font-semibold text-navy shrink-0 w-6 text-right">
                {item.label}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
      )}

      {subsection.nestedItems && (
        <ol className="ml-8 sm:ml-10 space-y-2 list-none border-l-2 border-gold/20 pl-4">
          {subsection.nestedItems.map((item) => (
            <li
              key={`${subsection.title}-nested-${item.label}`}
              className="flex gap-3 text-navy/70 text-[15px] sm:text-base leading-relaxed"
            >
              <span className="font-semibold text-navy shrink-0">
                {item.label}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function CollapsibleSection({
  heading,
  subsections,
  defaultOpen = false,
  index,
}: {
  heading: string;
  subsections: MembershipSubsection[];
  defaultOpen?: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      variants={fadeUp(index * 0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="rounded-2xl border border-navy/10 bg-white shadow-sm overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-5 sm:py-6 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gold shrink-0" />
          <h2 className="font-heading text-lg sm:text-xl font-extrabold text-navy uppercase tracking-tight">
            {heading}
          </h2>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-navy/40 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-8">
          <div className="w-full h-px bg-navy/5" />
          {subsections.map((subsection) => (
            <SubsectionBlock
              key={`${heading}-${subsection.title}`}
              subsection={subsection}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MembershipDescriptionContent() {
  return (
    <div className="space-y-5">
      {MEMBERSHIP_DESCRIPTION_SECTIONS.map((section, i) => (
        <CollapsibleSection
          key={section.heading}
          heading={section.heading}
          subsections={section.subsections}
          defaultOpen={i === 0}
          index={i}
        />
      ))}
    </div>
  );
}
