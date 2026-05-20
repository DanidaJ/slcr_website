import PageHeader from "@/components/the-college/PageHeader";

const SECTION_SKELETONS = Array.from({ length: 3 });
const ROW_SKELETONS = Array.from({ length: 6 });

export default function LoadingPastCouncils() {
  return (
    <>
      <PageHeader title="Past Councils" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8">
          {SECTION_SKELETONS.map((_, sectionIndex) => (
            <div
              key={`council-skeleton-${sectionIndex}`}
              className="rounded-2xl p-6 sm:p-8 bg-slate-50 animate-pulse"
            >
              <div className="h-6 sm:h-7 bg-slate-200 rounded w-1/2" />
              <div className="mt-4 w-12 h-0.5 bg-slate-200" />
              <div className="mt-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-3 bg-slate-200 rounded w-28" />
                </div>
                {ROW_SKELETONS.map((_, rowIndex) => (
                  <div
                    key={`row-skeleton-${sectionIndex}-${rowIndex}`}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4"
                  >
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-32" />
                    <div className="h-3 bg-slate-200 rounded w-40" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
