import PageHeader from "@/components/the-college/PageHeader";

const PARAGRAPHS = Array.from({ length: 6 });

export default function LoadingPastPresidentMessageDetail() {
  return (
    <>
      <PageHeader
        title="Past President's Message"
        subtitle="Loading message..."
      />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 sm:h-7 bg-slate-200 rounded w-2/3 animate-pulse" />
              <div className="space-y-3">
                {PARAGRAPHS.map((_, index) => (
                  <div
                    key={`paragraph-skeleton-${index}`}
                    className="h-3 sm:h-4 bg-slate-200 rounded w-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
