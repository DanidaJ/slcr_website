import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import NewsletterManager from "@/components/admin/NewsletterManager";

export const metadata: Metadata = {
  title: "Newsletter Admin",
  robots: { index: false, follow: false },
};

// Reads the session cookie per request.
export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  const authed = await isAdmin();
  return authed ? <NewsletterManager /> : <AdminLogin />;
}
