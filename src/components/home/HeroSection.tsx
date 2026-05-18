"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const DESKTOP_SRCS = [
  { webm: "/videos/background1.webm", mp4: "/videos/background1.mp4" },
  { webm: "/videos/background2.webm", mp4: "/videos/background2.mp4" },
];

const MOBILE_SRCS = [
  { mp4: "/videos/background_video_mobile.mp4" },
  { mp4: "/videos/background_video_mobile2.mp4" },
];

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [secondLoaded, setSecondLoaded] = useState(false);
  // null = device type not yet determined (avoids loading wrong sources on first render)
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const video0Ref = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const videoRefs = [video0Ref, video1Ref];
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Detect device type — stays null until this runs so we never load the wrong sources
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Start (or restart) the primary video once device type is known or changes.
  // By this point the correct <source> tags are already in the DOM.
  useEffect(() => {
    if (isMobile === null) return;
    const v0 = video0Ref.current;
    if (!v0) return;
    setActiveIdx(0);
    setSecondLoaded(false);
    v0.load();
    v0.play().catch(() => {});
  }, [isMobile]);

  // Defer loading the 2nd clip until the 1st is playing — saves bandwidth on first paint
  useEffect(() => {
    if (isMobile === null) return;
    const v0 = video0Ref.current;
    if (!v0) return;
    const onPlaying = () => setSecondLoaded(true);
    v0.addEventListener("playing", onPlaying, { once: true });
    const idleTimer = window.setTimeout(() => setSecondLoaded(true), 4000);
    return () => {
      v0.removeEventListener("playing", onPlaying);
      window.clearTimeout(idleTimer);
    };
  }, [isMobile]);

  useEffect(() => {
    if (secondLoaded) video1Ref.current?.load();
  }, [secondLoaded]);

  const handleVideoEnd = useCallback(() => {
    const nextIdx = activeIdx === 0 ? 1 : 0;
    setActiveIdx(nextIdx);
    videoRefs[nextIdx].current?.play().catch(() => {});
  }, [activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const srcs = isMobile ? MOBILE_SRCS : DESKTOP_SRCS;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[560px] h-[100svh] w-full overflow-hidden"
    >
      {/* Fallback — visible until video starts */}
      <div className="absolute inset-0 bg-navy" />

      {/* Video 0 — no autoPlay; we call .play() manually after device type is known */}
      <video
        ref={video0Ref}
        muted
        playsInline
        preload="none"
        poster="/videos/hero-poster.jpg"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          activeIdx === 0 ? "opacity-55" : "opacity-0 pointer-events-none"
        }`}
        onEnded={activeIdx === 0 ? handleVideoEnd : undefined}
      >
        {isMobile !== null && (
          <>
            {!isMobile && (
              <source src={DESKTOP_SRCS[0].webm} type="video/webm" />
            )}
            <source src={srcs[0].mp4} type="video/mp4" />
          </>
        )}
      </video>

      {/* Video 1 — deferred until video 0 starts playing */}
      <video
        ref={video1Ref}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          activeIdx === 1 ? "opacity-55" : "opacity-0 pointer-events-none"
        }`}
        onEnded={activeIdx === 1 ? handleVideoEnd : undefined}
      >
        {isMobile !== null && secondLoaded && (
          <>
            {!isMobile && (
              <source src={DESKTOP_SRCS[1].webm} type="video/webm" />
            )}
            <source src={srcs[1].mp4} type="video/mp4" />
          </>
        )}
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/35 to-navy/80 z-10" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center justify-center h-full text-center px-5 sm:px-6 lg:px-8"
      >
        <motion.h1
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="font-heading text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl text-white font-extrabold tracking-tight leading-[1.1] max-w-4xl 2xl:max-w-5xl"
        >
          Sri Lanka College
          <br className="hidden md:block" /> of Radiologists
        </motion.h1>

        <motion.div
          variants={fadeUp(0.45)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6"
        >
          <span className="w-6 sm:w-10 h-px bg-gold/60" />
          <p className="text-white/65 text-[10px] sm:text-[11px] md:text-xs font-medium tracking-[0.25em] sm:tracking-[0.35em] uppercase">
            To Enlighten &amp; Relieve
          </p>
          <span className="w-6 sm:w-10 h-px bg-gold/60" />
        </motion.div>

        <motion.div
          variants={fadeUp(0.7)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-8 sm:mt-12 w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <Link
            href="#"
            className="group relative inline-flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto pl-6 sm:pl-7 pr-2 py-2 rounded-full border border-white/40 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-sm font-semibold text-white group-hover:text-navy transition-colors duration-300">
              Upcoming Events
            </span>
            <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white group-hover:bg-navy transition-colors duration-300">
              <ArrowRight className="w-4 h-4 text-navy group-hover:text-white transition-colors duration-300" />
            </span>
          </Link>

          <Link
            href="#"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white py-2 transition-colors"
          >
            <span className="relative">
              Become a Member
              <span className="absolute left-0 -bottom-1 h-px w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40"
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.div>
    </section>
  );
}
