import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import PublicMessageViewer from "@/components/admin/PublicMessageViewer";

export const metadata: Metadata = {
  title: "Public Messages — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPublicMessagesPage() {
  const authed = await isAdmin();
  return authed ? <PublicMessageViewer /> : <AdminLogin />;
}
