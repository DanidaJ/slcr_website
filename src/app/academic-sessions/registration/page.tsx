import type { Metadata } from "next";
import { redirect } from "next/navigation";

/**
 * AAS Registration page — temporarily disabled for AAS 2027 (brochure-only).
 *
 * Restore when registration opens:
 * 1. Uncomment the REGISTRATION nav item in Navbar.tsx
 * 2. Restore the registration block in src/data/upcomingSessions.json
 * 3. Replace this redirect with the previous registration UI
 *    (see git history for the full fees / bank / Google Form page)
 */
export const metadata: Metadata = {
  title: "Registration | Sri Lanka College of Radiologists",
  description: "Registration for Annual Academic Sessions.",
};

export default function RegistrationPage() {
  redirect("/academic-sessions/upcoming-sessions");
}
