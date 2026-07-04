import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import HonourTable from "@/components/educations/HonourTable";
import { HONOUR_CONFIG } from "@/lib/honours";

const config = HONOUR_CONFIG["gold-medalists"];

export const metadata: Metadata = {
  title: `${config.title} | Sri Lanka College of Radiologists`,
  description: config.subtitle,
};

export default function GoldMedalistsPage() {
  return (
    <>
      <PageHeader
        title={config.title}
        eyebrow={config.eyebrow}
        subtitle={config.subtitle}
      />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <HonourTable category="gold-medalists" />
        </div>
      </section>
    </>
  );
}
