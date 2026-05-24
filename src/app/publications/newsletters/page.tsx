import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import NewsletterGrid from "@/components/newsletters/NewsletterGrid";
import { getNewsletters } from "@/lib/data/newsletters";

export const metadata: Metadata = {
  title: "Newsletters | Sri Lanka College of Radiologists",
  description:
    "Read and download Radiology News — the official newsletter of the Sri Lanka College of Radiologists.",
};

// Always reflect the latest admin changes.
export const dynamic = "force-dynamic";

export default async function NewslettersPage() {
  const newsletters = await getNewsletters();

  return (
    <>
      <PageHeader
        title="Newsletters"
        eyebrow="Publications"
        subtitle="Radiology News — the official newsletter of the Sri Lanka College of Radiologists."
      />

      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <NewsletterGrid newsletters={newsletters} />
        </div>
      </section>
    </>
  );
}
