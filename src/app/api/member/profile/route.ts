import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireMember, setMemberCookie } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { Member, MemberRegistration } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "members";

type ProfileResponse = {
  name: string;
  email: string;
  memberNumber?: string;
  status: Member["status"];
  registration: MemberRegistration;
};

/** Read the signed-in member's own record (identity + registration data). */
export async function GET() {
  const session = await requireMember();
  if (session instanceof Response) return session;

  const db = await getDb();
  const doc = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(session.memberId) });

  if (!doc) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const registration = (doc.registration as MemberRegistration) ?? {
    fullName: doc.name,
    email: doc.email,
    mobile: "",
  };

  const profile: ProfileResponse = {
    name: doc.name as string,
    email: doc.email as string,
    memberNumber: doc.memberNumber as string | undefined,
    status: doc.status as Member["status"],
    registration,
  };

  return Response.json({ profile });
}

/**
 * Update the member's own profile (registration form data). Email, username,
 * membership number, status, and role are NOT editable here — those are the
 * member's identity / admin-controlled fields.
 */
export async function PATCH(request: NextRequest) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  let body: Partial<MemberRegistration>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const mobile = body.mobile?.trim();

  if (!fullName) {
    return Response.json({ error: "Full name is required" }, { status: 400 });
  }
  if (!mobile) {
    return Response.json({ error: "Mobile number is required" }, { status: 400 });
  }

  const db = await getDb();
  const existing = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(session.memberId) });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const current = (existing.registration as MemberRegistration) ?? {};

  // Email and username stay fixed to the member's sign-in identity.
  const email = existing.email as string;

  const registration: MemberRegistration = {
    ...current,
    salutation: body.salutation?.trim() || undefined,
    fullName,
    nameWithInitials: body.nameWithInitials?.trim() || undefined,
    preferredName: body.preferredName?.trim() || undefined,
    nic: body.nic?.trim() || undefined,
    dob: body.dob || undefined,
    gender: body.gender || undefined,
    email,
    postalAddress: body.postalAddress?.trim() || undefined,
    workAddress: body.workAddress?.trim() || undefined,
    province: body.province || undefined,
    hospital: body.hospital?.trim() || undefined,
    post: body.post || undefined,
    mobile,
    office: body.office?.trim() || undefined,
    residence: body.residence?.trim() || undefined,
    fax: body.fax?.trim() || undefined,
    preferredContact: body.preferredContact?.trim() || undefined,
    medicalDegree: body.medicalDegree?.trim() || undefined,
    medicalSchool: body.medicalSchool?.trim() || undefined,
    pgQualifications: body.pgQualifications?.trim() || undefined,
    specialInterest: body.specialInterest?.trim() || undefined,
    username: (existing.username as string) || email,
  };

  await db
    .collection(COLLECTION)
    .updateOne(
      { _id: new ObjectId(session.memberId) },
      { $set: { name: fullName, registration } }
    );

  // Refresh the session cookie so the navbar chip reflects the new name.
  await setMemberCookie({ ...session, name: fullName });

  return Response.json({ ok: true });
}

/** Change the member's own password (requires the current password). */
export async function PUT(request: NextRequest) {
  const session = await requireMember();
  if (session instanceof Response) return session;

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!newPassword || newPassword.length < 8) {
    return Response.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const existing = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(session.memberId) });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const storedHash = existing.passwordHash as string | undefined;
  if (!storedHash || !verifyPassword(currentPassword, storedHash)) {
    return Response.json(
      { error: "Your current password is incorrect." },
      { status: 400 }
    );
  }

  await db
    .collection(COLLECTION)
    .updateOne(
      { _id: new ObjectId(session.memberId) },
      { $set: { passwordHash: hashPassword(newPassword) } }
    );

  return Response.json({ ok: true });
}
