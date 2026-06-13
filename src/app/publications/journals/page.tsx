import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import JournalContent from "@/components/publications/JournalContent";

export const metadata: Metadata = {
  title: "Journals | Sri Lanka College of Radiologists",
  description:
    "The Sri Lanka Journal of Radiology (SLJR) — a peer-reviewed, open-access journal published by the Sri Lanka College of Radiologists.",
};

export default function JournalsPage() {
  return (
    <>
      <PageHeader
        title="Journals"
        eyebrow="Publications"
        subtitle="The peer-reviewed, open-access journal of the Sri Lanka College of Radiologists."
      />

      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <JournalContent />
        </div>
      </section>
    </>
  );
}
