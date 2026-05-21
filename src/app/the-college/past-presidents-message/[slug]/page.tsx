import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/the-college/PageHeader";
import {
  getPastPresidentMessageBySlug,
  getPastPresidentMessageSlugs,
} from "@/lib/data/presidentMessages";

const PLACEHOLDER_IMAGE = "/images/Profile-Placeholder.png";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getPastPresidentMessageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PastPresidentsMessageDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const message = await getPastPresidentMessageBySlug(slug);

  if (!message) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Past President's Message" subtitle={message.name} />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/the-college/past-presidents-message"
              className="inline-flex items-center text-sm text-navy/60 hover:text-navy transition-colors"
            >
              ← Back to all messages
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-[22rem] xl:w-80 xl:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={message.image ?? PLACEHOLDER_IMAGE}
                  alt={message.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 320px, 360px"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold mb-4">
                {message.name}
              </h2>
              <div className="space-y-4 text-gray-600 text-[15px] sm:text-base leading-relaxed">
                {message.body.map((paragraph, index) => (
                  <p key={`${message.slug}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
