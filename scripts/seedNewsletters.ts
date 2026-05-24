import { config } from "dotenv";

config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import type { Newsletter } from "../src/lib/types";

/**
 * Seeds the four existing newsletters that currently live in public/docs.
 * They point at the local /docs path (no R2 pdfKey), so the public page and
 * viewer work immediately. New uploads via the admin portal will live in R2.
 */
const R2_BASE = process.env.R2_PUBLIC_BASE_URL ?? "https://pub-1f63d7069b2c4b658a5586f25ed04bb5.r2.dev";

const NEWSLETTERS: Omit<Newsletter, "_id">[] = [
  {
    title: "Radiology News",
    volume: 25,
    issue: 2,
    month: "December",
    year: 2025,
    pdfUrl: `${R2_BASE}/docs/News-letter-2025-issue2.pdf`,
    pdfKey: "docs/News-letter-2025-issue2.pdf",
    publishedAt: new Date("2025-12-01").toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    title: "Radiology News",
    volume: 25,
    issue: 1,
    month: "July",
    year: 2025,
    pdfUrl: `${R2_BASE}/docs/News-letter-2025-issue%201.pdf`,
    pdfKey: "docs/News-letter-2025-issue 1.pdf",
    publishedAt: new Date("2025-07-01").toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    title: "Radiology News",
    volume: 24,
    issue: 2,
    year: 2024,
    pdfUrl: `${R2_BASE}/docs/News-letter-2024-issue%202.pdf`,
    pdfKey: "docs/News-letter-2024-issue 2.pdf",
    publishedAt: new Date("2024-11-01").toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    title: "Radiology News",
    volume: 24,
    issue: 1,
    month: "May",
    year: 2024,
    pdfUrl: `${R2_BASE}/docs/News-letter-2024-issue1.pdf`,
    pdfKey: "docs/News-letter-2024-issue1.pdf",
    publishedAt: new Date("2024-05-01").toISOString(),
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local first.");
  }
  const dbName = process.env.MONGODB_DB ?? "slcr";

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    const newsletters = db.collection<Omit<Newsletter, "_id">>("newsletters");
    await newsletters.deleteMany({});
    await newsletters.insertMany(NEWSLETTERS);
    await newsletters.createIndex({ publishedAt: -1 });
    console.log(`Seeded newsletters: ${NEWSLETTERS.length} documents`);

    console.log("Seed complete.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
