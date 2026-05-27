import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";

export const metadata: Metadata = {
  title: "Workshops | Sri Lanka College of Radiologists",
  description:
    "Hands-on training workshops and skill-building sessions hosted by the Sri Lanka College of Radiologists.",
};

export default function WorkshopsPage() {
  return (
    <>
      <PageHeader
        title="Workshops"
        eyebrow="Educations"
        subtitle="Hands-on training sessions and skill-building opportunities."
      />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-surface p-6 sm:p-8 text-navy/70 text-sm leading-relaxed">
            Workshop announcements, registration details, and schedules will be
            updated here.
          </div>
        </div>
      </section>
    </>
  );
}
