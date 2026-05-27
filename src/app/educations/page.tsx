import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/the-college/PageHeader";

export const metadata: Metadata = {
  title: "Educations | Sri Lanka College of Radiologists",
  description:
    "Explore education resources including the Young Radiologist Forum, Workshops, and CPD.",
};

const EDUCATION_LINKS = [
  {
    title: "Young Radiologist Forum",
    description:
      "Programmes, discussions, and activities designed to support early-career radiologists.",
    href: "/educations/young-radiologist-forum",
  },
  {
    title: "Workshops",
    description:
      "Hands-on training sessions, specialty workshops, and skill-building opportunities.",
    href: "/educations/workshops",
  },
  {
    title: "CPD",
    description:
      "National Continuing Professional Development certificate guidance and points acquisition.",
    href: "/educations/cpd",
  },
];

export default function EducationsPage() {
  return (
    <>
      <PageHeader title="Educations" eyebrow="Education" />
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EDUCATION_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <h3 className="font-heading text-lg text-navy font-bold">
                  {link.title}
                </h3>
                <p className="mt-3 text-sm text-navy/60 leading-relaxed">
                  {link.description}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-gold">
                  View details →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
