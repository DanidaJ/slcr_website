import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Building2, ExternalLink } from "lucide-react";
import PageHeader from "@/components/the-college/PageHeader";
import sessionsData from "@/data/upcomingSessions.json";

type RegistrationRow = {
  category: string;
  currency: string;
  prices: string[];
};

type BankDetails = {
  bank: string;
  accountName: string;
  branch: string;
  accountNumber: string;
  bankCode: string;
  branchCode: string;
  swift: string;
};

type UpcomingSessionsMeta = {
  meta: {
    title: string;
  };
  registration: {
    note: string;
    columns: string[];
    rows: RegistrationRow[];
    bankDetails: BankDetails;
    registrationForm: {
      url: string;
      instruction: string;
    };
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4 py-2.5 border-b border-navy/10 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-navy/50 sm:w-36 shrink-0">
        {label}
      </dt>
      <dd className="text-sm sm:text-base font-semibold text-navy">{value}</dd>
    </div>
  );
}

export default function RegistrationPage() {
  const { meta, registration } = data;
  const { bankDetails, registrationForm } = registration;

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
          <div className="mb-8">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-navy/50">
              Registration
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
              Registration Fees
            </h2>

            <div
              className="mt-4 flex items-start gap-3 rounded-xl border-2 border-gold/50 bg-gold/10 px-4 py-3.5 sm:px-5 sm:py-4"
              role="note"
            >
              <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base font-semibold text-navy leading-relaxed">
                {registration.note}
              </p>
            </div>

            <div className="mt-4 w-12 h-0.5 bg-gold" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-navy/10 mb-10">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Bank details */}
            <div className="rounded-2xl border-2 border-navy/15 bg-surface overflow-hidden shadow-sm">
              <div className="bg-navy px-5 py-3.5 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-gold" />
                <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                  Bank Details
                </h3>
              </div>
              <dl className="px-5 py-2 sm:px-6">
                <DetailRow label="Bank" value={bankDetails.bank} />
                <DetailRow label="Account Name" value={bankDetails.accountName} />
                <DetailRow label="Branch" value={bankDetails.branch} />
                <DetailRow label="Account No." value={bankDetails.accountNumber} />
                <DetailRow label="Bank Code" value={bankDetails.bankCode} />
                <DetailRow label="Branch Code" value={bankDetails.branchCode} />
                <DetailRow label="SWIFT" value={bankDetails.swift} />
              </dl>
            </div>

            {/* Online registration */}
            <div className="rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-navy/[0.03] to-gold/[0.08] overflow-hidden shadow-sm flex flex-col">
              <div className="bg-gradient-to-r from-navy to-navy-dark px-5 py-3.5 flex items-center gap-2.5">
                <ExternalLink className="w-5 h-5 text-gold" />
                <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                  Register Online
                </h3>
              </div>
              <div className="px-5 py-5 sm:px-6 sm:py-6 flex flex-col flex-1">
                <p className="text-sm sm:text-base text-navy/80 leading-relaxed">
                  {registrationForm.instruction}
                </p>
                <Link
                  href={registrationForm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold text-navy text-sm font-bold uppercase tracking-wide hover:bg-gold-light transition-colors duration-300"
                >
                  Complete Google Form
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <p className="mt-3 text-xs text-navy/45 break-all">
                  {registrationForm.url}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
