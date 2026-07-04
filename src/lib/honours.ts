/**
 * Shared config for the three "honours" pages under Educations —
 * Fellowship Holders, Gold Medalists, and Orators. Each maps to its own
 * MongoDB collection and a small set of table columns. Imported by both the
 * public table component (client) and the API route (server); it holds no
 * secrets, only collection names and display metadata.
 */

export type HonourCategory =
  | "fellowship-holders"
  | "gold-medalists"
  | "orators";

export type HonourColumnKey = "name" | "award" | "year";

export type HonourColumn = { key: HonourColumnKey; label: string };

export type HonourConfig = {
  collection: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  columns: HonourColumn[];
};

/** A single row stored in one of the honours collections. */
export type HonourRecord = {
  _id: string;
  name: string;
  year: string;
  /** Gold medalists only. */
  award?: string;
  createdAt: string;
};

export const HONOUR_CONFIG: Record<HonourCategory, HonourConfig> = {
  "fellowship-holders": {
    collection: "fellowship_holders",
    title: "Fellowship Holders",
    eyebrow: "Educations",
    subtitle: "Fellows of the Sri Lanka College of Radiologists.",
    columns: [
      { key: "name", label: "Name" },
      { key: "year", label: "Year" },
    ],
  },
  "gold-medalists": {
    collection: "gold_medalists",
    title: "Gold Medalists",
    eyebrow: "Educations",
    subtitle: "Recipients of gold medals awarded by the College.",
    columns: [
      { key: "name", label: "Name" },
      { key: "award", label: "Award" },
      { key: "year", label: "Year" },
    ],
  },
  orators: {
    collection: "orators",
    title: "Orators",
    eyebrow: "Educations",
    subtitle: "Distinguished orators of the Sri Lanka College of Radiologists.",
    columns: [
      { key: "name", label: "Name" },
      { key: "year", label: "Year" },
    ],
  },
};

/** Resolve a raw route param to a known category config, or null. */
export function getHonourConfig(category: string): HonourConfig | null {
  return HONOUR_CONFIG[category as HonourCategory] ?? null;
}
