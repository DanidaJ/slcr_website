import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import HomeAnnouncementManager from "@/components/admin/HomeAnnouncementManager";

export const metadata: Metadata = {
  title: "Home Announcement — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminHomeAnnouncementPage() {
  const authed = await isAdmin();
  return authed ? <HomeAnnouncementManager /> : <AdminLogin />;
}
