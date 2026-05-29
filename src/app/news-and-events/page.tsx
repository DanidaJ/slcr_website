import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import NewsEventList from "@/components/news-events/NewsEventList";
import { getNewsEvents } from "@/lib/data/newsEvents";

export const metadata: Metadata = {
  title: "News and Events | Sri Lanka College of Radiologists",
  description:
    "Latest news and events from the Sri Lanka College of Radiologists.",
};

export const dynamic = "force-dynamic";

export default async function NewsAndEventsPage() {
  const items = await getNewsEvents();

  return (
    <>
      <PageHeader title="News and Events" eyebrow="Updates" />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <NewsEventList items={items} />
        </div>
      </section>
    </>
  );
}
