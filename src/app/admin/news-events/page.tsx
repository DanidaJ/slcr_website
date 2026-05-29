import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import NewsEventManager from "@/components/admin/NewsEventManager";

export const metadata: Metadata = {
  title: "News & Events Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminNewsEventsPage() {
  const authed = await isAdmin();
  return authed ? <NewsEventManager /> : <AdminLogin />;
}
