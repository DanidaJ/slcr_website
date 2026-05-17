"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeLeft, fadeRight } from "@/lib/motion";

const VIEWPORT = { once: false, margin: "-80px" } as const;

export default function PresidentMessage() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo side */}
          <motion.div
            variants={fadeLeft()}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative offset rings */}
              <div className="absolute -inset-3 rounded-2xl border border-white/15" />
              <div className="absolute -inset-6 rounded-2xl border border-white/[0.07]" />

              <div className="relative w-64 h-80 md:w-72 md:h-88 rounded-2xl overflow-hidden shadow-2xl shadow-navy-dark/60 bg-navy-light flex flex-col items-center justify-center gap-3">
                {/* Placeholder — drop president.jpg into /public/images/ to replace */}
                <div className="w-20 h-20 rounded-full bg-navy border-2 border-white/30 flex items-center justify-center">
                  <span className="text-white/70 text-xl font-heading font-extrabold">
                    NS
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-white/40 text-xs">
                    Add <code className="text-white/50">president.jpg</code>
                  </p>
                  <p className="text-white/30 text-[10px]">
                    to /public/images/
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            variants={fadeRight()}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-white"
          >
            <p className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Leadership
            </p>
            <h2 className="font-heading text-4xl font-extrabold tracking-tight mb-3">
              President&apos;s Message
            </h2>
            <div className="w-12 h-0.5 bg-gold mb-6" />

            <div className="mb-5">
              <p className="font-bold text-base text-white font-heading">
                Dr Nayana Samarasinghe
              </p>
              <p className="text-white/60 text-sm">The President</p>
              <p className="text-white/60 text-sm">
                Sri Lanka College of Radiologists
              </p>
            </div>

            {/* Quote block */}
            <div className="relative">
              <span className="absolute -top-6 -left-2 text-white/10 text-9xl font-heading font-extrabold leading-none select-none pointer-events-none">
                &ldquo;
              </span>
              <p className="relative text-white/75 leading-relaxed text-[15px] mb-4 pl-2">
                It is with great pride and honour that I welcome you to the
                official website of the Sri Lanka College of Radiologists. As
                President, I am privileged to represent a professional body that
                has consistently upheld excellence in radiology practice,
                education and research within our nation.
              </p>
              <p className="relative text-white/75 leading-relaxed text-[15px] pl-2">
                Radiology continues to be at the forefront of modern medicine —
                guiding diagnosis, influencing therapeutic decisions and shaping
                the future of patient care in Sri Lanka and beyond.
              </p>
            </div>

            <Link
              href="#"
              className="inline-block mt-8 px-6 py-3 border border-white/50 text-white text-sm font-semibold rounded hover:bg-white hover:text-navy transition-colors"
            >
              Read More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
