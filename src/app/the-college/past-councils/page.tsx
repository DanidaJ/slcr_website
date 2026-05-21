import PageHeader from "@/components/the-college/PageHeader";
import { getPastCouncils } from "@/lib/data/pastCouncils";
import type { CouncilEntry } from "@/lib/types";

const YEAR_STYLES = [
  "bg-slate-50",
  "bg-amber-50",
  "bg-emerald-50",
  "bg-blue-50",
  "bg-rose-50",
  "bg-indigo-50",
  "bg-teal-50",
  "bg-orange-50",
  "bg-lime-50",
  "bg-cyan-50",
  "bg-violet-50",
  "bg-stone-50",
];

function CouncilTable({ entries }: { entries: CouncilEntry[] }) {
  return (
    <div className="mt-3 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
        <span>Name</span>
        <span>Telephone</span>
        <span>Email Address</span>
      </div>
      {entries.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm text-navy/80"
        >
          <span className="font-medium text-navy">{entry.name}</span>
          <span>{entry.phone || "—"}</span>
          {entry.email ? (
            <a
              href={`mailto:${entry.email}`}
              className="text-navy/70 hover:text-navy transition-colors"
            >
              {entry.email}
            </a>
          ) : (
            <span className="text-navy/70">—</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default async function PastCouncilsPage() {
  const councils = await getPastCouncils();

  return (
    <>
      <PageHeader title="Past Councils" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8">
          {councils.map((year, index) => (
            <div
              key={year.title}
              className={`rounded-2xl p-6 sm:p-8 ${YEAR_STYLES[index % YEAR_STYLES.length]}`}
            >
              <div className="mb-6">
                <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
                  {year.title}
                </h2>
                <div className="mt-3 w-12 h-0.5 bg-gold" />
              </div>

              <div className="space-y-6">
                <CouncilTable entries={year.leaders} />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
                    Council Members
                  </p>
                  <CouncilTable entries={year.members} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
