import PageHeader from "@/components/the-college/PageHeader";

const SKELETONS = Array.from({ length: 8 });

export default function LoadingPastPresidents() {
  return (
    <>
      <PageHeader title="Past Presidents" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {SKELETONS.map((_, index) => (
              <div
                key={`president-skeleton-${index}`}
                className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse"
              >
                <div className="relative w-full aspect-[3/4] bg-slate-100" />
                <div className="p-4 sm:p-5 text-center space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
