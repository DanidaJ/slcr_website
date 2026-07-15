import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminAccessRestricted from "@/components/admin/AdminAccessRestricted";
import FellowshipDocManager from "@/components/admin/FellowshipDocManager";

export const metadata: Metadata = {
  title: "Fellowship Documents Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFellowshipPage() {
  const authed = await isAdmin();
  return authed ? <FellowshipDocManager /> : <AdminAccessRestricted />;
}
