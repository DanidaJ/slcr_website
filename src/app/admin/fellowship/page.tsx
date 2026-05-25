import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import FellowshipDocManager from "@/components/admin/FellowshipDocManager";

export const metadata: Metadata = {
  title: "Fellowship Documents Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFellowshipPage() {
  const authed = await isAdmin();
  return authed ? <FellowshipDocManager /> : <AdminLogin />;
}
