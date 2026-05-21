import Image from "next/image";
import { notFound } from "next/navigation";
import PageHeader from "@/components/the-college/PageHeader";
import { getCurrentPresidentMessage } from "@/lib/data/presidentMessages";

const PLACEHOLDER_IMAGE = "/images/Profile-Placeholder.png";

export default async function PresidentMessagePage() {
  const message = await getCurrentPresidentMessage();

  if (!message) {
    notFound();
  }

  return (
    <>
      <PageHeader title="President's Message" tone="dark" />
      <section className="py-14 sm:py-16 lg:py-20 bg-navy border-t border-navy-light/40">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-start">
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-2 sm:-inset-3 rounded-2xl border border-white/15" />
                <div className="absolute -inset-4 sm:-inset-6 rounded-2xl border border-white/[0.07]" />
                <div className="relative w-60 h-80 sm:w-64 sm:h-80 md:w-72 md:h-[22rem] xl:w-80 xl:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-navy-dark/60">
                  <Image
                    src={message.image ?? PLACEHOLDER_IMAGE}
                    alt={`${message.name} - President, Sri Lanka College of Radiologists`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 320px, 360px"
                  />
                </div>
              </div>
            </div>

            <div className="text-white">
              <div className="mb-6">
                <p className="font-bold text-lg text-white font-heading">
                  {message.name}
                </p>
                <p className="text-white/60 text-sm">The President</p>
                <p className="text-white/60 text-sm">
                  Sri Lanka College of Radiologists
                </p>
              </div>

              <div className="space-y-4 text-white/75 leading-relaxed text-[15px] sm:text-base">
                {message.body.map((paragraph, index) => (
                  <p key={`${message.slug}-${index}`}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 text-white/75 text-[15px] sm:text-base">
                <p>With sincere regards,</p>
                <p className="mt-4 font-semibold text-white">{message.name}</p>
                {message.tenure && (
                  <p className="text-white/65">
                    President &ndash; Sri Lanka College of Radiologists &ndash;
                    ({message.tenure})
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
