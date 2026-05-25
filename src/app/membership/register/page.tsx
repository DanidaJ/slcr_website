import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import RegisterForm from "@/components/membership/RegisterForm";

export const metadata: Metadata = {
  title: "Register | Sri Lanka College of Radiologists",
  description:
    "Register as a member of the Sri Lanka College of Radiologists.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader title="Register" eyebrow="Membership" tone="dark" />
      <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-surface to-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
