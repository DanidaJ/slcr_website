import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import MemberLoginForm from "@/components/membership/MemberLoginForm";

export const metadata: Metadata = {
  title: "Member Login | Sri Lanka College of Radiologists",
  description:
    "Log in to your Sri Lanka College of Radiologists member account.",
};

export default function MemberLoginPage() {
  return (
    <>
      <PageHeader title="Member Login" eyebrow="Membership" />
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-surface via-white to-surface overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-navy/[0.02] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gold/[0.03] blur-3xl" />
        </div>
        <div className="relative max-w-md mx-auto px-5 sm:px-6">
          <MemberLoginForm />
        </div>
      </section>
    </>
  );
}
