import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import PastSessionList from "@/components/past-sessions/PastSessionList";
import { getPastSessions } from "@/lib/data/pastSessions";

export const metadata: Metadata = {
  title: "Past Sessions | Sri Lanka College of Radiologists",
  description:
    "Browse past academic sessions of the Sri Lanka College of Radiologists.",
};

export const dynamic = "force-dynamic";

export default async function PastSessionsPage() {
  const sessions = await getPastSessions();

  return (
    <>
      <PageHeader
        title="Past Sessions"
        eyebrow="Academic Sessions"
        subtitle="A record of previous academic sessions hosted by the Sri Lanka College of Radiologists."
      />

      <section className="py-12 sm:py-14 lg:py-16 bg-surface">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <PastSessionList sessions={sessions} />
        </div>
      </section>
    </>
  );
}
