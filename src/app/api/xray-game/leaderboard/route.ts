import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { XrayScore } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTION = "xray_scores";
/** Rows sent to the client. */
const TOP_N = 10;
/** Rows kept in the collection — stops spam submissions growing it without bound. */
const KEEP_N = 50;
const MAX_NAME_LENGTH = 24;
/**
 * Floors that reject obviously junk submissions without ever rejecting a real
 * run. A scramble needs roughly 19 moves, so a fast player can get close to
 * these — keep them low rather than risk refusing a legitimate score.
 */
const MIN_SECONDS = 3;
const MAX_SECONDS = 86_400;
const MIN_MOVES = 10;

type ScoreDoc = Omit<XrayScore, "_id">;
type LeaderboardRow = { name: string; seconds: number };

async function readTopScores(): Promise<LeaderboardRow[]> {
  const db = await getDb();
  const rows = await db
    .collection<ScoreDoc>(COLLECTION)
    .find(
      {},
      {
        projection: { _id: 0, name: 1, seconds: 1 },
        // Ties go to whoever got there first.
        sort: { seconds: 1, createdAt: 1 },
        limit: TOP_N,
      }
    )
    .toArray();

  return rows.map((row) => ({ name: row.name, seconds: row.seconds }));
}

/**
 * Names are rendered by React (so escaping is handled), but control characters
 * would still let someone smear a row across the table.
 */
function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return "Anonymous";
  const cleaned = raw
    .replace(/\p{C}/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH)
    .trim();
  return cleaned || "Anonymous";
}

function isPlausibleCount(value: unknown, min: number, max: number): boolean {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

/** Public — top times for the chest X-ray puzzle. */
export async function GET() {
  try {
    return Response.json({ scores: await readTopScores() });
  } catch {
    return Response.json({ error: "Leaderboard unavailable." }, { status: 503 });
  }
}

/** Public — submit a finished run and get the updated leaderboard back. */
export async function POST(request: NextRequest) {
  let body: { name?: unknown; seconds?: unknown; moves?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isPlausibleCount(body.seconds, MIN_SECONDS, MAX_SECONDS)) {
    return Response.json({ error: "Invalid time." }, { status: 400 });
  }
  if (!isPlausibleCount(body.moves, MIN_MOVES, Number.MAX_SAFE_INTEGER)) {
    return Response.json({ error: "Invalid move count." }, { status: 400 });
  }

  const doc: ScoreDoc = {
    name: cleanName(body.name),
    seconds: body.seconds as number,
    moves: body.moves as number,
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    const collection = db.collection<ScoreDoc>(COLLECTION);
    await collection.insertOne(doc);

    // Trim by explicit id so runs tied on `seconds` can't accumulate forever.
    const survivors = await collection
      .find(
        {},
        {
          projection: { _id: 1 },
          sort: { seconds: 1, createdAt: 1 },
          limit: KEEP_N,
        }
      )
      .toArray();
    await collection.deleteMany({
      _id: { $nin: survivors.map((row) => row._id) },
    });

    return Response.json(
      { ok: true, scores: await readTopScores() },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: "Could not save score." }, { status: 503 });
  }
}
