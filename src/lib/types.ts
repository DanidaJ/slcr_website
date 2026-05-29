export type PresidentMessage = {
  slug: string;
  name: string;
  image?: string;
  tenure?: string;
  excerpt: string;
  body: string[];
  createdAt: Date;
};

export type PastPresident = {
  name: string;
  image?: string;
  term?: string;
  order: number;
};

export type CouncilEntry = {
  name: string;
  phone?: string;
  email?: string;
};

export type PastCouncil = {
  title: string;
  year: number;
  leaders: CouncilEntry[];
  members: CouncilEntry[];
};

export type Newsletter = {
  _id?: string;
  title: string;
  volume?: number;
  issue?: number;
  month?: string;
  year: number;
  /** Full URL to the PDF (R2 public URL, or a local /docs path for seeded items) */
  pdfUrl: string;
  /** R2 object key — present only for files uploaded to R2 (enables deletion) */
  pdfKey?: string;
  publishedAt: string;
  createdAt: string;
};

export type FellowshipDocument = {
  _id?: string;
  title: string;
  description?: string;
  pdfUrl: string;
  pdfKey?: string;
  createdAt: string;
};

/**
 * A member record. Created when a member submits the registration form
 * (status: "pending"). Admin approves (status: "active") before the member
 * can sign in with Google.
 */
export type Member = {
  _id?: string;
  /** Lowercased email — also the Google account they sign in with. */
  email: string;
  /** Full name, from the registration form. */
  name: string;
  username?: string;
  /** Membership/registration number, assigned by admin after approval. */
  memberNumber?: string;
  /** Access level. Defaults to "member" when absent. Seeded manually for admins. */
  role?: "member" | "admin";
  status: "pending" | "active" | "suspended";
  createdAt: string;
  /** ISO timestamp of the member's most recent successful login. */
  lastLoginAt?: string;
  /** Full registration form data, stored as submitted. */
  registration?: MemberRegistration;
};

/** All fields collected on the /membership/register form. */
export type MemberRegistration = {
  salutation?: string;
  fullName: string;
  nameWithInitials?: string;
  preferredName?: string;
  nic?: string;
  dob?: string;
  gender?: string;
  email: string;
  postalAddress?: string;
  workAddress?: string;
  province?: string;
  hospital?: string;
  post?: string;
  mobile: string;
  office?: string;
  residence?: string;
  fax?: string;
  preferredContact?: string;
  medicalDegree?: string;
  medicalSchool?: string;
  pgQualifications?: string;
  specialInterest?: string;
  username?: string;
};

export type NewsEvent = {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  imageUrl: string;
  imageKey?: string;
  publishedAt: string;
  createdAt: string;
};
