"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { fadeUp } from "@/lib/motion";

type PricingTier = {
  label: string;
  price: string;
};

export type SubscriptionCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  featured?: boolean;
  tiers?: PricingTier[];
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  delay?: number;
};

const VIEWPORT = { once: true, margin: "-60px" } as const;

export default function SubscriptionCard({
  title,
  subtitle,
  description,
  featured = false,
  tiers,
  features,
  ctaLabel = "Sign Up",
  ctaHref = "#",
  delay = 0,
}: SubscriptionCardProps) {
  return (
    <motion.div
      variants={fadeUp(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`relative rounded-2xl border overflow-hidden transition-shadow duration-300 hover:shadow-xl ${
        featured
          ? "border-gold/40 bg-navy shadow-lg"
          : "border-navy/10 bg-white shadow-sm"
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
      )}

      <div className="p-6 sm:p-8">
        {subtitle && (
          <p
            className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2 ${
              featured ? "text-gold" : "text-navy/40"
            }`}
          >
            {subtitle}
          </p>
        )}

        <h3
          className={`font-heading text-xl sm:text-2xl font-extrabold tracking-tight ${
            featured ? "text-white" : "text-navy"
          }`}
        >
          {title}
        </h3>

        <div
          className={`mt-3 w-10 h-0.5 ${featured ? "bg-gold" : "bg-gold/60"}`}
        />

        {description && (
          <p
            className={`mt-4 text-sm sm:text-base leading-relaxed ${
              featured ? "text-white/70" : "text-navy/60"
            }`}
          >
            {description}
          </p>
        )}

        {tiers && tiers.length > 0 && (
          <div className="mt-5 space-y-2.5">
            {tiers.map((tier) => (
              <div
                key={tier.label}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  featured
                    ? "bg-white/[0.07] border border-white/10"
                    : "bg-surface border border-navy/5"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    featured ? "text-white/80" : "text-navy/70"
                  }`}
                >
                  {tier.label}
                </span>
                <span
                  className={`font-heading text-base sm:text-lg font-bold ${
                    featured ? "text-gold" : "text-navy"
                  }`}
                >
                  {tier.price}
                </span>
              </div>
            ))}
          </div>
        )}

        {features && features.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    featured ? "text-gold" : "text-gold"
                  }`}
                />
                <span
                  className={`text-sm ${
                    featured ? "text-white/70" : "text-navy/60"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Link
          href={ctaHref}
          className={`mt-6 block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            featured
              ? "bg-gold text-navy hover:bg-gold-light"
              : "bg-navy text-white hover:bg-navy-dark"
          }`}
        >
          {ctaLabel}
        </Link>
      </div>
    </motion.div>
  );
}
