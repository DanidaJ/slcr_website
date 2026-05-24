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
