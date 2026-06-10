import type { Metadata } from "next";
import MemberInbox from "@/components/member-portal/MemberInbox";

export const metadata: Metadata = {
  title: "Inbox — Member Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function MemberInboxPage() {
  return <MemberInbox />;
}
