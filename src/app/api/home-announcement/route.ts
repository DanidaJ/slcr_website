import { getActiveHomeAnnouncement } from "@/lib/data/homeAnnouncement";

export const dynamic = "force-dynamic";

/** Public — active home hero announcement, if any. */
export async function GET() {
  const announcement = await getActiveHomeAnnouncement();
  return Response.json({ announcement });
}
