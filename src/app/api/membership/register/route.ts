import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Member, MemberRegistration } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Public — member self-registration. Creates a pending application. */
export async function POST(request: NextRequest) {
  let body: Partial<MemberRegistration>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const fullName = body.fullName?.trim();
  const mobile = body.mobile?.trim();

  if (!email || !fullName || !mobile) {
    return Response.json(
      { error: "Full name, email, and mobile are required" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const db = await getDb();

  // Reject if an application or account already exists for this email.
  const existing = await db.collection("members").findOne({ email });
  if (existing) {
    const msg =
      existing.status === "pending"
        ? "An application for this email is already pending review."
        : "An account with this email already exists.";
    return Response.json({ error: msg }, { status: 409 });
  }

  const registration: MemberRegistration = {
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
    username: body.username?.trim() || undefined,
  };

  const doc: Omit<Member, "_id"> = {
    email,
    name: fullName,
    username: body.username?.trim() || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
    registration,
  };

  await db.collection("members").insertOne(doc);

  return Response.json({ ok: true }, { status: 201 });
}
