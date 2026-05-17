"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, CalendarDays, Stethoscope } from "lucide-react";
import { fadeLeft, fadeRight, fadeUp, staggerContainer } from "@/lib/motion";

const STATS = [
  { icon: Users, label: "Members", value: "331+" },
  { icon: CalendarDays, label: "Established", value: "1980" },
  { icon: Stethoscope, label: "Specialities", value: "2" },
];

const VIEWPORT = { once: false, margin: "-80px" } as const;

export default function OurCollege() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <motion.div
            variants={fadeLeft()}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <p className="text-navy/50 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Who We Are
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy font-extrabold tracking-tight leading-tight mb-3">
              Sri Lanka College
              <br />
              of Radiologists
            </h2>
            <div className="w-12 h-0.5 bg-gold mb-6" />

            <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
              The Sri Lanka College of Radiologists, established in January 1980
              and officially renamed in 2004, is a distinguished institution
              dedicated to representing both Clinical Radiology and Radiation
              Oncology.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">
              Aligned with the Postgraduate Institute of Medicine, University of
              Colombo, the college is committed to training competent
              Radiologists and Radiotherapists. With a membership of 331, the
              SLCR serves as the sole authority overseeing professional
              standards of Radiologists in Sri Lanka — fostering local academic
              activities and encouraging global participation.
            </p>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp()}
                  className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <stat.icon className="w-5 h-5 text-navy/70 mx-auto mb-2" />
                  <p className="font-heading text-2xl text-navy font-extrabold">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <Link
              href="#"
              className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-navy text-navy text-sm font-semibold rounded hover:bg-navy hover:text-white transition-colors"
            >
              Read More
            </Link>
          </motion.div>

          {/* Image side */}
          <motion.div
            variants={fadeRight()}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="relative"
          >
            {/* Decorative offset frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-navy/15 rounded-xl pointer-events-none" />

            <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-navy-light to-navy flex flex-col items-center justify-center gap-2">
              {/* Placeholder — drop college-building.jpg into /public/images/ to replace */}
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white/60 text-xl font-heading font-extrabold">
                  SLCR
                </span>
              </div>
              <p className="text-white/30 text-xs">
                Add{" "}
                <code className="text-white/50">
                  /public/images/college-building.jpg
                </code>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
