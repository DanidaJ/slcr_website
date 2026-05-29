import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import MemberManager from "@/components/admin/MemberManager";

export const metadata: Metadata = {
  title: "Member Admin",
  robots: { index: false, follow: false },
};

// Reads the session cookie per request.
export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const authed = await isAdmin();
  return authed ? <MemberManager /> : <AdminLogin />;
}
