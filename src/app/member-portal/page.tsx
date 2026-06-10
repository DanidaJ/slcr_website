import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, ArrowRight } from "lucide-react";
import { getMemberSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Member Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MemberPortalPage() {
  // The layout already guards access; this is just for greeting + counts.
  const session = await getMemberSession();
  const firstName =
    session?.name?.split(" ").find((p) => !/^dr\.?$/i.test(p)) ??
    session?.email.split("@")[0] ??
    "Member";

  let unread = 0;
  if (session) {
    const db = await getDb();
    unread = await db
      .collection("member_inbox")
      .countDocuments({ memberId: session.memberId, readAt: { $exists: false } });
  }

  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Member Portal
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy">
          Welcome, {firstName}
        </h1>
        <p className="mt-1 text-navy/55">
          Messages, announcements, and documents from the College arrive here.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 pb-16">
        <Link
          href="/member-portal/inbox"
          className="group flex items-center justify-between rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm transition hover:border-gold/50 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy">
              <Inbox className="h-6 w-6" />
              {unread > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-navy">Inbox</h2>
              <p className="text-sm text-navy/55">
                {unread > 0
                  ? `${unread} unread ${unread === 1 ? "item" : "items"}`
                  : "You're all caught up"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-navy/40 transition group-hover:translate-x-1 group-hover:text-gold" />
        </Link>
      </div>
    </div>
  );
}
