import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminAccessRestricted from "@/components/admin/AdminAccessRestricted";
import CorrespondenceDetail from "@/components/admin/CorrespondenceDetail";

export const metadata: Metadata = {
  title: "Correspondence — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCorrespondenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authed = await isAdmin();
  return authed ? <CorrespondenceDetail id={id} /> : <AdminAccessRestricted />;
}
