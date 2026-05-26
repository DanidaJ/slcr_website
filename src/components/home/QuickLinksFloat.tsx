"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  {
    full: "Ministry of Health",
    href: "https://www.health.gov.lk/home/",
    logo: "/images/gov-logo.png",
    logoSize: "w-8 h-8",
  },
  {
    full: "HRMIS",
    href: "https://hrmis-sm.health.gov.lk/login",
    logo: "/images/gov-logo.png",
    logoSize: "w-8 h-8",
  },
  {
    full: "SLAERC",
    href: "https://www.aerc.gov.lk/Home/index.php?lang=en",
    logo: "/images/slaerc-logo.png",
    logoSize: "w-7 h-7",
  },
  {
    full: "PGIM",
    href: "https://pgim.cmb.ac.lk/",
    logo: "/images/pgim-logo.png",
    logoSize: "w-8 h-8",
  },
  {
    full: "NMRA",
    href: "https://www.nmra.gov.lk/",
    logo: "https://www.google.com/s2/favicons?domain=nmra.gov.lk&sz=32",
    logoSize: "w-6 h-6",
  },
  {
    full: "SLMA",
    href: "https://slmc.gov.lk/en/",
    logo: "https://www.google.com/s2/favicons?domain=slmc.gov.lk&sz=32",
    logoSize: "w-6 h-6",
  },
];

function LinkList() {
  return (
    <ul className="space-y-0.5">
      {LINKS.map((link) => (
        <li key={link.full}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/65 hover:text-white hover:bg-white/[0.08] transition-all duration-200 group"
          >
            {/* Fixed-width slot keeps all text labels aligned */}
            <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={link.logo}
                alt=""
                width={36}
                height={36}
                className={`${link.logoSize} object-contain`}
              />
            </span>
            <span className="text-[12.5px] leading-snug font-medium">
              {link.full}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── Desktop side panel ── */
function DesktopPanel({ inHero }: { inHero: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div
        className={`flex rounded-l-xl overflow-hidden border border-r-0 border-white/15 shadow-2xl shadow-black/50 transition-colors duration-500 ${
          inHero
            ? "bg-navy/60 backdrop-blur-lg"
            : "bg-[#0c1735]/95 backdrop-blur-sm"
        }`}
      >
        {/* Collapse tab */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-9 flex-shrink-0 flex flex-col items-center justify-center gap-3 py-5 bg-white/[0.03] hover:bg-white/[0.08] border-r border-white/10 text-white/35 hover:text-gold transition-colors min-h-[220px]"
          aria-label={collapsed ? "Expand quick links" : "Collapse quick links"}
        >
          {collapsed ? (
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          )}
          <span
            className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Quick Links
          </span>
        </button>

        {/* Animated content */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="content"
              initial={{ width: 0 }}
              animate={{ width: 192 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="w-48 py-3">
                <LinkList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Mobile FAB + popover ── */
function MobilePanel({ inHero }: { inHero: boolean }) {
  const [open, setOpen] = useState(false);

  const cardBg = inHero
    ? "bg-navy/60 backdrop-blur-lg"
    : "bg-[#0c1735]/95 backdrop-blur-sm";

  return (
    <div className="lg:hidden fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${cardBg} border border-white/15 rounded-xl shadow-2xl shadow-black/50 w-52 origin-bottom-right transition-colors duration-500`}
          >
            <div className="py-3">
              <LinkList />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.6 }}
        onClick={() => setOpen((v) => !v)}
        className={`${cardBg} flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 shadow-xl shadow-black/40 text-white hover:border-gold/50 transition-colors duration-500`}
      >
        <Link2 className="w-4 h-4 text-gold" />
        <span className="text-xs font-semibold tracking-wide">Quick Links</span>
      </motion.button>
    </div>
  );
}

export default function QuickLinksFloat() {
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    function onScroll() {
      // Hero is 100svh — once scrolled past it, go solid
      setInHero(window.scrollY < window.innerHeight * 0.85);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <DesktopPanel inHero={inHero} />
      <MobilePanel inHero={inHero} />
    </>
  );
}
