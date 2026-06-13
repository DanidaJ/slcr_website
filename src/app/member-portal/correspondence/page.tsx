import type { Metadata } from "next";
import { getMemberSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import CorrespondenceForm from "@/components/member-portal/CorrespondenceForm";
import type { Correspondence } from "@/lib/types";

export const metadata: Metadata = {
  title: "Correspondence — Member Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CorrespondencePage() {
  const session = await getMemberSession();

  let sent: Correspondence[] = [];
  if (session) {
    const db = await getDb();
    const docs = await db
      .collection("correspondence")
      .find({ memberId: session.memberId })
      .sort({ sentAt: -1 })
      .toArray();
    sent = docs.map(({ _id, ...rest }) => ({
      _id: _id.toString(),
      ...(rest as Omit<Correspondence, "_id">),
    }));
  }

  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Member Portal
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy">
          Correspondence
        </h1>
        <p className="mt-1 text-navy/55 mb-8">
          Send a message or document to the College admin team.
        </p>
        <CorrespondenceForm sent={sent} />
      </div>
    </div>
  );
}
