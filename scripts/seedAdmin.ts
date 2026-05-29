import { config } from "dotenv";

config({ path: ".env.local" });

import { MongoClient } from "mongodb";

/**
 * Seeds (or promotes) an admin member account. The given email can then sign
 * in with Google and will have role "admin" — unlocking the admin sections in
 * the navbar and all /admin/* pages.
 *
 * Usage:
 *   npm run seed:admin                       (uses ADMIN_EMAIL below)
 *   npm run seed:admin -- other@gmail.com    (override the email)
 */

const ADMIN_EMAIL = process.argv[2] ?? "officialdinorage@gmail.com";

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local first.");
  }
  const dbName = process.env.MONGODB_DB ?? "slcr";

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const members = db.collection("members");

    // Email is the login identity — keep it unique.
    await members.createIndex({ email: 1 }, { unique: true });

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const result = await members.updateOne(
      { email },
      {
        $set: { role: "admin", status: "active" },
        $setOnInsert: {
          email,
          name: "SLCR Admin",
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    const action = result.upsertedCount ? "created" : "updated";
    console.log(`Admin ${action}: ${email}`);
  } finally {
    await client.close();
  }
}

seedAdmin().catch((err) => {
  console.error("Admin seed failed:", err);
  process.exit(1);
});
