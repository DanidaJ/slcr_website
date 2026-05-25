import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import SubscriptionRegisterForm from "@/components/membership/SubscriptionRegisterForm";

export const metadata: Metadata = {
  title: "Register | Subscription Plan | Sri Lanka College of Radiologists",
  description:
    "Register for a subscription plan with the Sri Lanka College of Radiologists.",
};

export default function SubscriptionRegisterPage() {
  return (
    <>
      <PageHeader title="Register" eyebrow="Subscription Plan" tone="dark" />
      <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-surface to-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <SubscriptionRegisterForm />
        </div>
      </section>
    </>
  );
}
