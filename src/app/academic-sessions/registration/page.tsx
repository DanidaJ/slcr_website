import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import sessionsData from "@/data/upcomingSessions.json";

type RegistrationRow = {
  category: string;
  currency: string;
  prices: string[];
};

type UpcomingSessionsMeta = {
  meta: {
    title: string;
  };
  registration: {
    note: string;
    columns: string[];
    rows: RegistrationRow[];
  };
  contact: {
    office: string;
  };
};

const data = sessionsData as unknown as UpcomingSessionsMeta;

export const metadata: Metadata = {
  title: `Registration — ${data.meta.title} | Sri Lanka College of Radiologists`,
  description: `Registration fees for the ${data.meta.title}. ${data.registration.note}`,
};

export default function RegistrationPage() {
  const { meta, registration } = data;

  return (
    <>
      <PageHeader
        title="Registration"
        eyebrow="Academic Sessions"
        subtitle={meta.title}
        tone="dark"
      />

      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-navy/50">
              Registration
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
              Registration Fees
            </h2>
            <p className="mt-2 text-sm text-navy/60">{registration.note}</p>
            <div className="mt-4 w-12 h-0.5 bg-gold" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-navy/10">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left font-semibold px-4 py-3.5">
                    Category
                  </th>
                  {registration.columns.map((column) => (
                    <th
                      key={column}
                      className="text-left font-medium px-4 py-3.5 text-white/85 text-[13px]"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/[0.08]">
                {registration.rows.map((row) => (
                  <tr key={row.category} className="hover:bg-surface/60">
                    <td className="px-4 py-3.5 font-semibold text-navy whitespace-nowrap">
                      {row.category}
                    </td>
                    {row.prices.map((price, index) => (
                      <td key={index} className="px-4 py-3.5 text-navy/75">
                        {row.currency} {price}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
    </>
  );
}
