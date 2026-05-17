"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { fadeUp, fadeRight } from "@/lib/motion";
import storiesData from "@/data/stories.json";

type Story = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  featured: boolean;
  href: string;
};

const stories: Story[] = storiesData;

const VIEWPORT = { once: false, margin: "-80px" } as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Monochrome navy placeholder — single consistent colour for every card */
function CardPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center overflow-hidden">
      <span className="text-white/[0.06] font-heading font-extrabold text-7xl select-none">
        {label}
      </span>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-navy/15 text-navy/70 bg-navy/[0.03]">
      {category}
    </span>
  );
}

export default function LatestStories() {
  const featured = stories.find((s) => s.featured);
  const secondary = stories.filter((s) => !s.featured);

  // Auto-rotating slideshow for the side column
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    if (secondary.length < 2) return;
    const id = setInterval(() => setRotation((r) => r + 1), 3800);
    return () => clearInterval(id);
  }, [secondary.length]);

  const offset = rotation % secondary.length;
  const rotated = [
    ...secondary.slice(offset),
    ...secondary.slice(0, offset),
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-navy/50 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              Latest From Us
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy font-extrabold tracking-tight">
              Latest Stories
            </h2>
            <div className="mt-3 w-12 h-0.5 bg-gold" />
          </div>
          <Link
            href="#"
            className="group hidden sm:flex items-center gap-1.5 text-navy hover:text-navy/60 text-sm font-semibold transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured card */}
          {featured && (
            <motion.article
              variants={fadeUp()}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="lg:col-span-3"
            >
              <Link
                href={featured.href}
                className="group block h-full rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="h-60 overflow-hidden">
                  <CardPlaceholder label={featured.category} />
                </div>
                <div className="p-7 border-l-2 border-transparent group-hover:border-gold transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <CategoryBadge category={featured.category} />
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(featured.date)}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl text-navy font-bold mb-3 group-hover:text-navy/70 transition-colors leading-snug">
                    {featured.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Side column — auto-rotating slideshow */}
          <motion.div
            variants={fadeRight()}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <AnimatePresence mode="popLayout">
              {rotated.map((story) => (
                <motion.article
                  key={story.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    layout: { duration: 0.7, ease: "easeInOut" },
                    opacity: { duration: 0.5 },
                  }}
                >
                  <Link
                    href={story.href}
                    className="group flex rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-24 flex-shrink-0 min-h-[104px]">
                      <CardPlaceholder label={story.category} />
                    </div>
                    <div className="flex-1 p-4 border-l-2 border-transparent group-hover:border-gold transition-colors duration-300">
                      <div className="mb-1.5">
                        <CategoryBadge category={story.category} />
                      </div>
                      <h3 className="font-heading text-sm text-navy font-bold group-hover:text-navy/70 transition-colors leading-snug line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-400 text-[11px] mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(story.date)}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>

            {/* Slideshow progress dots */}
            <div className="flex justify-center gap-1.5 pt-1">
              {secondary.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === offset ? "w-5 bg-gold" : "w-1.5 bg-navy/15"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
