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
  /** Scrypt hash for email/password sign-in (set during registration). */
  passwordHash?: string;
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

/**
 * An item delivered to a single member's inbox. A broadcast fans out into one
 * `member_inbox` document per active member (type "broadcast", text only); a
 * direct message is a single document (type "message", may carry one file).
 */
export type InboxItem = {
  _id?: string;
  /** Recipient member's _id (string form). */
  memberId: string;
  type: "broadcast" | "message";
  subject: string;
  /** Plain-text body. Optional for file-only direct messages. */
  body?: string;
  /** Attachment (direct messages only) — R2 public URL, key, and original name. */
  fileUrl?: string;
  fileKey?: string;
  fileName?: string;
  /** ISO timestamp when the member opened the item; absent while unread. */
  readAt?: string;
  sentAt: string;
  /** Email of the admin who sent it (audit trail). */
  sentBy: string;
};

/** A message sent from a member to the admin team (correspondence). */
export type Correspondence = {
  _id?: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  subject: string;
  body?: string;
  fileUrl?: string;
  fileKey?: string;
  fileName?: string;
  /** ISO timestamp when an admin first opened the item. */
  readAt?: string;
  sentAt: string;
};

/** A record of one broadcast, for the admin's send history. */
export type Broadcast = {
  _id?: string;
  subject: string;
  body: string;
  /** How many member inboxes it was delivered to. */
  recipientCount: number;
  sentAt: string;
  sentBy: string;
};

export type CouncilMemberGender = "male" | "female";

/** Current or historical council member — stored in MongoDB. */
export type CouncilMember = {
  _id?: string;
  name: string;
  gender: CouncilMemberGender;
  email?: string;
  /** e.g. "The President", "Hon. Secretary" */
  position?: string;
  displayOrder: number;
  /** R2 object key, e.g. images/the-college/president-and-council-26-27/Dr Nayana Samarasinghe.jpg */
  imageKey?: string;
  /** Council term label, e.g. "2026-2027" */
  term: string;
  createdAt: string;
};

/** Council member as returned to the frontend (image URL resolved server-side). */
export type CouncilMemberPublic = {
  id: string;
  name: string;
  gender: CouncilMemberGender;
  email?: string;
  position?: string;
  displayOrder: number;
  imageUrl: string | null;
  placeholderUrl: string;
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
