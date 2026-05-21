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
