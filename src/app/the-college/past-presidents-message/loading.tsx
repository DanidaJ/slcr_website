import PageHeader from "@/components/the-college/PageHeader";

const SKELETONS = Array.from({ length: 6 });

export default function LoadingPastPresidentsMessage() {
  return (
    <>
      <PageHeader title="Past President's Message" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {SKELETONS.map((_, index) => (
              <div
                key={`message-skeleton-${index}`}
                className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse"
              >
                <div className="relative w-full aspect-[4/3] bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                  <div className="h-9 bg-slate-200 rounded w-28 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
