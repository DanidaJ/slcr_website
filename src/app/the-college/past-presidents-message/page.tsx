import PageHeader from "@/components/the-college/PageHeader";
import PastPresidentMessageCard from "@/components/the-college/PastPresidentMessageCard";
import { getPastPresidentMessages } from "@/lib/data/presidentMessages";

const PLACEHOLDER_IMAGE = "/images/Profile-Placeholder.png";

export default async function PastPresidentsMessagePage() {
  const messages = await getPastPresidentMessages();

  return (
    <>
      <PageHeader title="Past President's Message" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {messages.map((message) => (
              <PastPresidentMessageCard
                key={message.slug}
                name={message.name}
                excerpt={message.excerpt}
                href={`/the-college/past-presidents-message/${message.slug}`}
                image={message.image ?? PLACEHOLDER_IMAGE}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
