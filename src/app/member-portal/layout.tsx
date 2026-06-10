import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getMemberSession } from "@/lib/auth";

// Reads the session cookie per request — never prerender.
export const dynamic = "force-dynamic";

/**
 * Protected shell for the member portal. Any signed-in member (or admin) may
 * enter; everyone else is bounced to the login page. Route handlers under
 * /api/member enforce the same boundary independently.
 */
export default async function MemberPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getMemberSession();
  if (!session) redirect("/membership/member-login");

  return (
    <>
      <Navbar transparentOnTop={false} />
      {children}
    </>
  );
}
