import { getDb } from "@/lib/mongodb";
import { requireMember } from "@/lib/auth";
import type { MemberRegistration } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "members";

type DirectoryMember = {
  memberNumber: string;
  name: string;
  mobile: string;
  hospital: string;
};

/**
 * Member directory for signed-in members (and admins). Returns only
 * active members with a safe projection — no email, password, or status.
 */
export async function GET() {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find(
      { status: "active", memberNumber: { $exists: true, $nin: [null, ""] } },
      {
        projection: {
          memberNumber: 1,
          name: 1,
          "registration.fullName": 1,
          "registration.mobile": 1,
          "registration.hospital": 1,
        },
      }
    )
    .toArray();

  const members: DirectoryMember[] = docs.map((doc) => {
    const registration = doc.registration as MemberRegistration | undefined;
    return {
      memberNumber: (doc.memberNumber as string) ?? "",
      name: (doc.name as string) || registration?.fullName || "",
      mobile: registration?.mobile ?? "",
      hospital: registration?.hospital ?? "",
    };
  });

  // Natural ascending order on membership number (e.g. 2 before 10).
  members.sort((a, b) =>
    a.memberNumber.localeCompare(b.memberNumber, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  return Response.json({ members });
}
