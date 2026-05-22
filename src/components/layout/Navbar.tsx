"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

type NavbarProps = {
  transparentOnTop?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: "/" },
  {
    label: "THE COLLEGE",
    href: "#",
    children: [
      { label: "PRESIDENT'S MESSAGE", href: "/the-college/president-message" },
      {
        label: "PRESIDENT AND COUNCIL",
        href: "/the-college/president-and-council",
      },
      {
        label: "PAST PRESIDENT'S MESSAGE",
        href: "/the-college/past-presidents-message",
      },
      { label: "PAST PRESIDENTS", href: "/the-college/past-presidents" },
      { label: "PAST COUNCILS", href: "/the-college/past-councils" },
      {
        label: "HISTORY OF THE COLLEGE",
        href: "/the-college/history-of-the-college",
      },
      {
        label: "COMMITTEES AND SUBCOMMITTEES",
        href: "/the-college/committees-and-subcommittees",
      },
    ],
  },
  {
    label: "ACADEMIC SESSIONS",
    href: "#",
    children: [
      {
        label: "Upcoming Sessions",
        href: "/academic-sessions/upcoming-sessions",
      },
      { label: "Past Sessions", href: "#" },
      {
        label: "Registration",
        href: "/academic-sessions/registration",
      },
    ],
  },
  {
    label: "MEMBERSHIP",
    href: "#",
    children: [
      { label: "Become a Member", href: "#" },
      { label: "Member Benefits", href: "#" },
      { label: "Member Directory", href: "#" },
    ],
  },
  { label: "NEWS AND EVENTS", href: "#" },
  { label: "TOP STORIES", href: "#" },
  {
    label: "PUBLICATIONS",
    href: "#",
    children: [
      { label: "Journal", href: "#" },
      { label: "Newsletter", href: "#" },
      { label: "Guidelines & Standards", href: "#" },
    ],
  },
  {
    label: "EDUCATIONS",
    href: "#",
    children: [
      { label: "Postgraduate Training", href: "#" },
      { label: "CME", href: "#" },
      { label: "Fellowships", href: "#" },
    ],
  },
  { label: "CONTACT US", href: "/contact-us" },
];

export default function Navbar({ transparentOnTop = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const isSolid = !transparentOnTop || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid ? "bg-navy shadow-lg shadow-navy-dark/40" : "bg-transparent"
        }`}
      >
        {/* Utility bar */}
        <div
          className={`hidden lg:block border-b transition-colors duration-300 ${
            isSolid ? "border-navy-light/50" : "border-white/20"
          }`}
        >
          <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-6 lg:px-8 py-2 flex items-center justify-between">
            <span className="text-white/60 text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="px-4 py-1.5 text-xs font-medium text-white/90 hover:text-white border border-white/30 hover:border-white/60 rounded transition-colors"
              >
                MEMBER LOGIN
              </Link>
              <Link
                href="#"
                className="px-4 py-1.5 text-xs font-semibold bg-gold text-navy rounded hover:bg-gold-light transition-colors"
              >
                BECOME A MEMBER
              </Link>
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <nav className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 lg:py-3 gap-3">
            {/* Logo + name */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0"
            >
              <Image
                src="/images/logo.png"
                alt="SLCR Logo"
                width={40}
                height={40}
                className="flex-shrink-0 object-contain"
              />
              <div>
                <p className="text-white font-bold text-[12px] sm:text-sm leading-tight font-heading whitespace-nowrap">
                  Sri Lanka College of Radiologists
                </p>
                <p className="text-white/55 text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase whitespace-nowrap">
                  To Enlighten &amp; Relieve
                </p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden xl:flex items-center">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-0.5 px-2.5 py-2 text-white/85 hover:text-white text-[11px] font-medium tracking-wide transition-colors whitespace-nowrap"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    )}
                  </Link>

                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 bg-navy-dark border border-navy-light/60 rounded-lg shadow-xl py-1.5 min-w-[190px] z-50"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-white/75 hover:text-white hover:bg-navy-light/50 text-xs transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="xl:hidden text-white p-2 -mr-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-navy-dark z-50 overflow-y-auto overscroll-contain"
            >
              <div className="p-5 sm:p-6">
                {/* Drawer header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/images/logo.png"
                      alt="SLCR Logo"
                      width={34}
                      height={34}
                      className="flex-shrink-0 object-contain"
                    />
                    <div>
                      <p className="text-white font-bold text-sm font-heading">
                        SLCR
                      </p>
                      <p className="text-white/55 text-[11px] font-medium tracking-[0.15em] uppercase">
                        To Enlighten &amp; Relieve
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav items */}
                <nav className="space-y-0.5">
                  {NAV_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="border-b border-navy-light/40"
                    >
                      <Link
                        href={item.href}
                        className="block py-3 text-white/85 hover:text-white font-medium text-sm transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="pl-4 pb-2 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block py-1 text-white/50 hover:text-white text-xs transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Auth buttons */}
                <div className="mt-8 space-y-2">
                  <Link
                    href="#"
                    className="block text-center py-2.5 border border-white/30 text-white text-sm rounded hover:border-white/60 transition-colors"
                  >
                    MEMBER LOGIN
                  </Link>
                  <Link
                    href="#"
                    className="block text-center py-2.5 bg-gold text-navy text-sm font-semibold rounded hover:bg-gold-light transition-colors"
                  >
                    BECOME A MEMBER
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
