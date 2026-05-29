import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import PageHeader from "@/components/the-college/PageHeader";
import NewsEventImage from "@/components/news-events/NewsEventImage";
import { getNewsEventBySlug } from "@/lib/data/newsEvents";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsEventBySlug(slug);
  if (!item) {
    return { title: "News and Events | Sri Lanka College of Radiologists" };
  }
  return {
    title: `${item.title} | Sri Lanka College of Radiologists`,
    description: item.excerpt,
  };
}

export const dynamic = "force-dynamic";

export default async function NewsEventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsEventBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <PageHeader title="News and Events" eyebrow="Updates" />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link
            href="/news-and-events"
            className="inline-flex items-center text-sm text-navy/60 hover:text-navy transition-colors mb-8"
          >
            ← Back to all news and events
          </Link>

          <p className="text-xs text-navy/45 flex items-center gap-1.5 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(item.publishedAt)}
          </p>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight leading-snug">
            {item.title}
          </h1>
          <div className="mt-4 w-12 h-0.5 bg-gold" />

          <div className="relative mt-8 aspect-[16/9] rounded-2xl overflow-hidden border border-navy/10 shadow-sm">
            <NewsEventImage
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <div className="mt-8 space-y-4 text-navy/70 text-[15px] sm:text-base leading-relaxed">
            {item.body.map((paragraph, index) => (
              <p key={`${item.slug}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
