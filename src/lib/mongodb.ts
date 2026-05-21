import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "slcr";

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to .env.local."
  );
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise: Promise<MongoClient> =
  globalThis._mongoClientPromise ??
  (globalThis._mongoClientPromise = new MongoClient(uri).connect());

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
