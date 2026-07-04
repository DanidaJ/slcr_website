"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, LogOut, User, ShieldCheck, Inbox } from "lucide-react";
import type { MemberSession } from "@/lib/auth";

const ADMIN_LINKS: { label: string; href: string }[] = [
  { label: "Members", href: "/admin/members" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Public Messages", href: "/admin/public-messages" },
  { label: "Correspondence", href: "/admin/correspondence" },
  { label: "Newsletters", href: "/admin/newsletters" },
  { label: "News & Events", href: "/admin/news-events" },
  { label: "Home Announcement", href: "/admin/home-announcement" },
  { label: "Past Sessions", href: "/admin/past-sessions" },
  { label: "Fellowship", href: "/admin/fellowship" },
];

const MEMBER_LINKS: { label: string; href: string }[] = [
  { label: "Inbox", href: "/member-portal/inbox" },
  { label: "Correspondence", href: "/member-portal/correspondence" },
];

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
        label: "UPCOMING SESSIONS",
        href: "/academic-sessions/upcoming-sessions",
      },
      { label: "PAST SESSIONS", href: "/academic-sessions/past-sessions" },
      {
        label: "REGISTRATION",
        href: "/academic-sessions/registration",
      },
    ],
  },
  {
    label: "MEMBERSHIP",
    href: "#",
    children: [
      { label: "DESCRIPTION", href: "/membership/description" },
      { label: "FELLOWSHIP APPLICATION", href: "/membership/fellowship" },
      { label: "MEMBER LOGIN", href: "/membership/member-login" },
    ],
  },
  { label: "NEWS AND EVENTS", href: "/news-and-events" },
  {
    label: "PUBLICATIONS",
    href: "#",
    children: [
      { label: "JOURNAL", href: "/publications/journals" },
      { label: "NEWSLETTER", href: "/publications/newsletters" },
    ],
  },
  {
    label: "EDUCATIONS",
    href: "/educations",
    children: [
      {
        label: "YOUNG RADIOLOGIST FORUM",
        href: "/educations/young-radiologist-forum",
      },
      { label: "WORKSHOPS", href: "/educations/workshops" },
      { label: "CPD", href: "/educations/cpd" },
      { label: "FELLOWSHIP HOLDERS", href: "/educations/fellowship-holders" },
      { label: "GOLD MEDALISTS", href: "/educations/gold-medalists" },
      { label: "ORATORS", href: "/educations/orators" },
    ],
  },
  { label: "CONTACT US", href: "/contact-us" },
];

/** Two-letter initials from a name, e.g. "Dr. Jane Perera" → "JP" */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((p) => !/^dr\.?$/i.test(p));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Chip shown in the navbar when the member is signed in. */
function MemberChip({
  member,
  onSignOut,
  dark = false,
}: {
  member: MemberSession;
  onSignOut: () => void;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const firstName = member.name?.split(" ").find((p) => !/^dr\.?$/i.test(p)) ?? member.email.split("@")[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
          dark
            ? "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
            : "border-navy/20 hover:border-navy/40 bg-navy/5 hover:bg-navy/10"
        }`}
      >
        {/* Avatar circle */}
        <span className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-navy text-[10px] font-extrabold flex-shrink-0">
          {initials(member.name ?? member.email)}
        </span>
        <span className={`text-xs font-semibold ${dark ? "text-white" : "text-navy"} max-w-[120px] truncate`}>
          {firstName}
        </span>
        <ChevronDown className={`w-3 h-3 ${dark ? "text-white/60" : "text-navy/50"} transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-navy-dark border border-navy-light/60 rounded-xl shadow-xl py-2 min-w-[180px] z-50"
          >
            <div className="px-4 py-2 border-b border-navy-light/30">
              <p className="text-white text-xs font-semibold truncate">{member.name}</p>
              <p className="text-white/45 text-[11px] truncate">{member.email}</p>
              {member.memberNumber && (
                <p className="mt-0.5 text-gold/80 text-[11px] font-medium truncate">
                  Membership No: {member.memberNumber}
                </p>
              )}
            </div>

            <button
              onClick={() => { setOpen(false); onSignOut(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar({ transparentOnTop = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [member, setMember] = useState<MemberSession | null>(null);
  const [unread, setUnread] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isSolid = !transparentOnTop || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/member")
      .then((r) => r.json())
      .then((d) => setMember(d.member ?? null))
      .catch(() => null);
  }, [pathname]);

  useEffect(() => {
    if (!member) { setUnread(0); return; }
    fetch("/api/member/inbox")
      .then((r) => r.json())
      .then((d) => setUnread(d.unread ?? 0))
      .catch(() => null);
  }, [member]);

  async function handleSignOut() {
    await fetch("/api/auth/member", { method: "DELETE" });
    setMember(null);
    router.refresh();
  }

  // Utility bar: home page (all sizes) or signed-in users (desktop only on inner pages).
  const showUtilityBar = isHome || !!member;

  const isChildActive = (href: string) =>
    href !== "#" && (pathname === href || pathname.startsWith(`${href}/`));

  const isItemActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    if (
      item.href !== "#" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`))
    ) {
      return true;
    }
    return item.children?.some((c) => isChildActive(c.href)) ?? false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid ? "bg-navy shadow-lg shadow-navy-dark/40" : "bg-transparent"
        }`}
      >
        {/* Utility bar — home page (all sizes); signed-in users on inner pages (lg+ only) */}
        {showUtilityBar && (
          <div
            className={`${isHome ? "" : "hidden lg:block"} border-b transition-colors duration-300 ${
              isSolid ? "border-navy-light/50" : "border-white/20"
            }`}
          >
            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-end lg:justify-between gap-2">
              {/* Left label — desktop only */}
              <div className="hidden lg:block min-w-0">
                {isHome ? (
                  <span className="text-white/60 text-xs">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                ) : member?.role === "admin" ? (
                  <span className="flex items-center gap-1.5 text-gold/70 text-xs font-semibold uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Panel
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-white/50 text-xs font-semibold uppercase tracking-widest">
                    <Inbox className="w-3.5 h-3.5" />
                    Member Portal
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Admin dropdown */}
                {member?.role === "admin" && (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("ADMIN_BAR")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold text-gold border border-gold/40 hover:border-gold hover:bg-gold/10 transition-colors whitespace-nowrap">
                      ADMIN
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {activeDropdown === "ADMIN_BAR" && (
                      <div className="absolute right-0 top-full pt-1.5 min-w-[170px] z-50">
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="bg-navy-dark border border-gold/30 rounded-lg shadow-xl py-1.5"
                      >
                        {ADMIN_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-white/75 hover:text-white hover:bg-navy-light/50 text-xs transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </motion.div>
                      </div>
                    )}
                  </div>
                )}

                {/* MY PORTAL dropdown — regular members only */}
                {member?.role === "member" && (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("PORTAL_BAR")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-gold border border-gold/40 hover:border-gold hover:bg-gold/10 transition-colors whitespace-nowrap">
                      MY PORTAL
                      {unread > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {activeDropdown === "PORTAL_BAR" && (
                      <div className="absolute right-0 top-full pt-1.5 min-w-[150px] z-50">
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="bg-navy-dark border border-gold/30 rounded-lg shadow-xl py-1.5"
                      >
                        {MEMBER_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-white/75 hover:text-white hover:bg-navy-light/50 text-xs transition-colors"
                          >
                            {link.label}
                            {link.href === "/member-portal/inbox" && unread > 0 && (
                              <span className="ml-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {unread}
                              </span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                      </div>
                    )}
                  </div>
                )}

                {/* Member chip / login buttons */}
                {member ? (
                  <MemberChip member={member} onSignOut={handleSignOut} dark />
                ) : (
                  <>
                    <Link
                      href="/membership/member-login"
                      className="px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white/90 hover:text-white border border-white/30 hover:border-white/60 rounded transition-colors whitespace-nowrap"
                    >
                      MEMBER LOGIN
                    </Link>
                    <Link
                      href="/membership/register"
                      className="px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold bg-gold text-navy rounded hover:bg-gold-light transition-colors whitespace-nowrap"
                    >
                      BECOME A MEMBER
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main nav bar */}
        <nav className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 lg:py-3 gap-3">
            {/* Logo + name */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0"
            >
              <Image
                src="/images/logo.png"
                alt="SLCR Logo"
                width={44}
                height={44}
                className="flex-shrink-0 object-contain lg:w-9 lg:h-9 xl:w-10 xl:h-10"
              />
              <div>
                <p className="text-white font-bold text-sm sm:text-[15px] lg:text-[12px] xl:text-[13px] leading-tight font-heading whitespace-nowrap">
                  Sri Lanka College of Radiologists
                </p>
                <p className="text-white/55 text-[10px] sm:text-xs lg:text-[9px] xl:text-[10px] font-medium tracking-[0.15em] uppercase whitespace-nowrap">
                  To Enlighten &amp; Relieve
                </p>
              </div>
            </Link>

            {/* Desktop nav links — xl+ only; tablets use hamburger to avoid overflow */}
            <div className="hidden xl:flex items-center">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                return (
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
                      className={`flex items-center gap-0.5 px-1 lg:px-1 xl:px-1.5 2xl:px-2.5 py-2 text-[11px] xl:text-xs font-medium tracking-normal transition-colors whitespace-nowrap ${
                        active ? "text-white" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown
                          className={`w-3 h-3 ${active ? "opacity-90" : "opacity-70"}`}
                        />
                      )}
                    </Link>

                    {/* Active underline indicator */}
                    <span
                      className={`pointer-events-none absolute left-1 right-1 -bottom-0.5 h-0.5 rounded-full bg-gold transition-opacity duration-200 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />

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
                            className={`block px-4 py-2 text-xs transition-colors ${
                              isChildActive(child.href)
                                ? "text-gold bg-navy-light/30"
                                : "text-white/75 hover:text-white hover:bg-navy-light/50"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hamburger — below xl (tablets + mobile) */}
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
                  {NAV_ITEMS.map((item) => {
                    const active = isItemActive(item);
                    return (
                    <div
                      key={item.label}
                      className="border-b border-navy-light/40"
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 py-3 font-medium text-sm transition-colors ${
                          active ? "text-gold" : "text-white/85 hover:text-white"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {active && (
                          <span className="h-4 w-0.5 rounded-full bg-gold" />
                        )}
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="pl-4 pb-2 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={`block py-1 text-xs transition-colors ${
                                isChildActive(child.href)
                                  ? "text-gold"
                                  : "text-white/50 hover:text-white"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    );
                  })}

                  {member?.role === "admin" && (
                    <div className="border-b border-gold/30">
                      <p className="py-3 text-gold/90 font-medium text-sm flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        ADMIN
                      </p>
                      <div className="pl-4 pb-2 space-y-1">
                        {ADMIN_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1 text-white/50 hover:text-white text-xs transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {member?.role === "member" && (
                    <div className="border-b border-gold/30">
                      <p className="py-3 text-gold/90 font-medium text-sm flex items-center gap-1.5">
                        <Inbox className="w-3.5 h-3.5" />
                        MY PORTAL
                      </p>
                      <div className="pl-4 pb-2 space-y-1">
                        {MEMBER_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1 text-white/50 hover:text-white text-xs transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </nav>

                {/* Auth section */}
                <div className="mt-8">
                  {member ? (
                    <div className="rounded-xl border border-white/15 bg-white/5 overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                        <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy text-xs font-extrabold flex-shrink-0">
                          {initials(member.name ?? member.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{member.name}</p>
                          <p className="text-white/45 text-xs truncate">{member.email}</p>
                          {member.memberNumber && (
                            <p className="text-gold/80 text-xs font-medium truncate">
                              Membership No: {member.memberNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => { setMobileOpen(false); handleSignOut(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-white/70 hover:text-white text-sm transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/membership/member-login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 border border-white/30 text-white text-sm rounded hover:border-white/60 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        MEMBER LOGIN
                      </Link>
                      <Link
                        href="/membership/register"
                        onClick={() => setMobileOpen(false)}
                        className="block text-center py-2.5 bg-gold text-navy text-sm font-semibold rounded hover:bg-gold-light transition-colors"
                      >
                        BECOME A MEMBER
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
