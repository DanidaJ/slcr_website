"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fadeUp } from "@/lib/motion";

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const video0Ref = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const videoRefs = [video0Ref, video1Ref];
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: content drifts up + fades as you scroll past the hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const handleVideoEnd = useCallback(() => {
    const nextIdx = activeIdx === 0 ? 1 : 0;
    setActiveIdx(nextIdx);
    videoRefs[nextIdx].current?.play();
  }, [activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Fallback */}
      <div className="absolute inset-0 bg-navy" />

      {/* Video 0 */}
      <video
        ref={video0Ref}
        src="/videos/background1.mp4"
        muted
        playsInline
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          activeIdx === 0 ? "opacity-55" : "opacity-0 pointer-events-none"
        }`}
        onEnded={activeIdx === 0 ? handleVideoEnd : undefined}
      />

      {/* Video 1 */}
      <video
        ref={video1Ref}
        src="/videos/background2.mp4"
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          activeIdx === 1 ? "opacity-55" : "opacity-0 pointer-events-none"
        }`}
        onEnded={activeIdx === 1 ? handleVideoEnd : undefined}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/35 to-navy/80 z-10" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <motion.h1
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-white font-extrabold tracking-tight leading-[1.1] max-w-4xl"
        >
          Sri Lanka College
          <br className="hidden md:block" /> of Radiologists
        </motion.h1>

        <motion.div
          variants={fadeUp(0.45)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mt-6"
        >
          <span className="w-10 h-px bg-gold/60" />
          <p className="text-white/65 text-[11px] md:text-xs font-medium tracking-[0.35em] uppercase">
            To Enlighten &amp; Relieve
          </p>
          <span className="w-10 h-px bg-gold/60" />
        </motion.div>

        <motion.div
          variants={fadeUp(0.7)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-6 mt-12"
        >
          {/* Primary — pill with sweep fill + arrow badge */}
          <Link
            href="#"
            className="group relative inline-flex items-center gap-4 pl-7 pr-2 py-2 rounded-full border border-white/40 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-sm font-semibold text-white group-hover:text-navy transition-colors duration-300">
              Upcoming Events
            </span>
            <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white group-hover:bg-navy transition-colors duration-300">
              <ArrowRight className="w-4 h-4 text-navy group-hover:text-white transition-colors duration-300" />
            </span>
          </Link>

          {/* Secondary — underline-reveal text link */}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
