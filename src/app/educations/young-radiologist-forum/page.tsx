import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";

export const metadata: Metadata = {
  title: "Young Radiologist Forum | Sri Lanka College of Radiologists",
  description:
    "Resources and activities for the Young Radiologist Forum of the Sri Lanka College of Radiologists.",
};

export default function YoungRadiologistForumPage() {
  return (
    <>
      <PageHeader
        title="Young Radiologist Forum"
        eyebrow="Educations"
        subtitle="Programmes and activities for early-career radiologists."
      />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-surface p-6 sm:p-8 text-navy/70 text-sm leading-relaxed">
            Updates, schedules, and learning opportunities for the Young
            Radiologist Forum will be shared here.
          </div>
        </div>
      </section>
    </>
  );
}
