import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminAccessRestricted from "@/components/admin/AdminAccessRestricted";
import PastSessionManager from "@/components/admin/PastSessionManager";

export const metadata: Metadata = {
  title: "Past Sessions Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPastSessionsPage() {
  const authed = await isAdmin();
  return authed ? <PastSessionManager /> : <AdminAccessRestricted />;
}
