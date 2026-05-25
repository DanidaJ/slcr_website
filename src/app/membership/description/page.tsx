import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import MembershipDescriptionContent from "@/components/membership/MembershipDescriptionContent";

export const metadata: Metadata = {
  title: "Description | Sri Lanka College of Radiologists",
  description:
    "Membership categories, rights, fees, fellowships, and termination provisions of the Sri Lanka College of Radiologists.",
};

export default function MembershipDescriptionPage() {
  return (
    <>
      <PageHeader title="Description" eyebrow="Membership" />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <MembershipDescriptionContent />
        </div>
      </section>
    </>
  );
}
