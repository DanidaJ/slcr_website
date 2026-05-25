import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import FellowshipContent from "@/components/membership/FellowshipContent";
import { getFellowshipDocuments } from "@/lib/data/fellowshipDocuments";

export const metadata: Metadata = {
  title: "Fellowship | Sri Lanka College of Radiologists",
  description:
    "Fellowship of Sri Lanka College of Radiologists (FSLCR) — nomination criteria, guidelines, and downloadable forms.",
};

export const dynamic = "force-dynamic";

export default async function FellowshipPage() {
  const documents = await getFellowshipDocuments();

  return (
    <>
      <PageHeader title="Fellowship" eyebrow="Membership" />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <FellowshipContent documents={documents} />
        </div>
      </section>
    </>
  );
}
