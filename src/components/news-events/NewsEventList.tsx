"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsEvent } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import NewsEventImage from "./NewsEventImage";

const VIEWPORT = { once: true, margin: "-40px" } as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type NewsEventListProps = {
  items: NewsEvent[];
};

export default function NewsEventList({ items }: NewsEventListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-surface px-6 py-16 text-center">
        <p className="text-navy/50 text-sm sm:text-base">
          No news and events have been published yet. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-navy/10">
      {items.map((item, index) => (
        <motion.li
          key={item._id ?? item.slug}
          variants={fadeUp(index * 0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="py-8 sm:py-10 first:pt-0 last:pb-0"
        >
          <article className="flex flex-col sm:flex-row gap-5 sm:gap-8">
            <Link
              href={`/news-and-events/${item.slug}`}
              className="group relative block w-full sm:w-52 md:w-60 lg:w-64 aspect-[16/10] sm:aspect-[4/3] flex-shrink-0 rounded-xl overflow-hidden border border-navy/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <NewsEventImage
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </Link>

            <div className="flex-1 min-w-0 flex flex-col">
              <p className="text-xs text-navy/45 flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(item.publishedAt)}
              </p>
              <h2 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-navy leading-snug">
                <Link
                  href={`/news-and-events/${item.slug}`}
                  className="hover:text-navy/70 transition-colors"
                >
                  {item.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-navy/60 leading-relaxed line-clamp-3">
                {item.excerpt}
              </p>
              <div className="mt-5">
                <Link
                  href={`/news-and-events/${item.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-navy/15 bg-white text-sm font-medium text-navy hover:border-gold/50 hover:text-navy/80 transition-all group"
                >
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 transition-transform" />
                  Read More
                </Link>
              </div>
            </div>
          </article>
        </motion.li>
      ))}
    </ul>
  );
}
