import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminAccessRestricted from "@/components/admin/AdminAccessRestricted";
import CorrespondenceManager from "@/components/admin/CorrespondenceManager";

export const metadata: Metadata = {
  title: "Correspondence — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCorrespondencePage() {
  const authed = await isAdmin();
  return authed ? <CorrespondenceManager /> : <AdminAccessRestricted />;
}
