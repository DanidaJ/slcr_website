import Image from "next/image";
import PageHeader from "@/components/the-college/PageHeader";
import { getPastPresidents } from "@/lib/data/pastPresidents";

const PLACEHOLDER_IMAGE = "/images/Profile-Placeholder.png";

export default async function PastPresidentsPage() {
  const presidents = await getPastPresidents();

  return (
    <>
      <PageHeader title="Past Presidents" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {presidents.map((president, index) => (
              <article
                key={`${president.name}-${index}`}
                className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
                  <Image
                    src={president.image ?? PLACEHOLDER_IMAGE}
                    alt={president.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>
                <div className="p-4 sm:p-5 text-center">
                  <h3 className="font-heading text-lg text-navy font-bold leading-snug">
                    {president.name}
                  </h3>
                  {president.term && (
                    <p className="text-sm text-navy/60 mt-1">
                      {president.term}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
