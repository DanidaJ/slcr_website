import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";
import SubscriptionCard from "@/components/membership/SubscriptionCard";

export const metadata: Metadata = {
  title: "Subscription Plan | Sri Lanka College of Radiologists",
  description:
    "Membership subscription plans and registration for the Sri Lanka College of Radiologists.",
};

const PLANS = [
  {
    title: "Free Membership",
    subtitle: "Basic Access",
    description:
      "Free level allowing limited access to most of our content. Perfect for exploring what the college has to offer.",
    features: [
      "Access to public content",
      "Newsletter updates",
      "Event announcements",
      "Community forum access",
    ],
    ctaLabel: "Sign Up",
    ctaHref: "/membership/register",
    featured: false,
    delay: 0,
  },
  {
    title: "Annual Academic Sessions",
    subtitle: "Conference Registration",
    tiers: [
      { label: "Non Radiology Consultant", price: "Rs 6,000" },
      { label: "Radiology Consultant", price: "Rs 5,000" },
      { label: "Non Radiology Trainee", price: "Rs 4,000" },
      { label: "Radiology Trainee", price: "Rs 3,000" },
    ],
    features: [
      "Full conference access",
      "Workshop participation",
      "Conference materials",
      "Networking sessions",
      "Certificate of attendance",
    ],
    ctaLabel: "Sign Up",
    ctaHref: "/membership/register",
    featured: true,
    delay: 0.1,
  },
] as const;

export default function ApplicationPage() {
  return (
    <>
      <PageHeader title="Subscription Plan" eyebrow="Membership" />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {PLANS.map((plan) => (
              <SubscriptionCard
                key={plan.title}
                title={plan.title}
                subtitle={plan.subtitle}
                description={"description" in plan ? plan.description : undefined}
                tiers={"tiers" in plan ? [...plan.tiers] : undefined}
                features={[...plan.features]}
                ctaLabel={plan.ctaLabel}
                ctaHref={plan.ctaHref}
                featured={plan.featured}
                delay={plan.delay}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
