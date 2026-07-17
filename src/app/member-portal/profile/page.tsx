import type { Metadata } from "next";
import { ObjectId } from "mongodb";
import { getMemberSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import ProfileForm from "@/components/member-portal/ProfileForm";
import type { Member, MemberRegistration } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Profile — Member Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // The layout already guards access; this loads the member's own record.
  const session = await getMemberSession();

  let name = session?.name ?? "";
  let email = session?.email ?? "";
  let memberNumber = session?.memberNumber;
  let status: Member["status"] = "active";
  let registration: MemberRegistration = {
    fullName: name,
    email,
    mobile: "",
  };

  if (session) {
    const db = await getDb();
    const doc = await db
      .collection("members")
      .findOne({ _id: new ObjectId(session.memberId) });
    if (doc) {
      name = doc.name as string;
      email = doc.email as string;
      memberNumber = doc.memberNumber as string | undefined;
      status = doc.status as Member["status"];
      registration =
        (doc.registration as MemberRegistration) ?? {
          fullName: name,
          email,
          mobile: "",
        };
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Member Portal
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-navy">
          My Profile
        </h1>
        <p className="mt-1 text-navy/55 mb-8">
          Review and update the details on your membership record. Keeping these
          current helps the College reach you.
        </p>
        <ProfileForm
          name={name}
          email={email}
          memberNumber={memberNumber}
          status={status}
          registration={registration}
        />
      </div>
    </div>
  );
}
