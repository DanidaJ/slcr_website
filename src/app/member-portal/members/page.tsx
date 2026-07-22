import type { Metadata } from "next";
import MembersDirectory from "@/components/member-portal/MembersDirectory";

export const metadata: Metadata = {
  title: "Members — Member Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function MembersPage() {
  // Auth is enforced by member-portal/layout.tsx (redirects public visitors).
  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Member Portal
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy">
          Members
        </h1>
        <p className="mt-1 text-navy/55 mb-8">
          Directory of College members, ordered by membership number. Sort by
          name or hospital using the column headers.
        </p>
        <MembersDirectory />
      </div>
    </div>
  );
}
