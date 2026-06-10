import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import MessageCenter from "@/components/admin/MessageCenter";

export const metadata: Metadata = {
  title: "Messages — Admin",
  robots: { index: false, follow: false },
};

// Reads the session cookie per request.
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const authed = await isAdmin();
  return authed ? <MessageCenter /> : <AdminLogin />;
}
