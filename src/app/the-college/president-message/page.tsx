import Image from "next/image";
import PageHeader from "@/components/the-college/PageHeader";

const MESSAGE_PARAGRAPHS = [
  "It is with great pride and honour that I welcome you to the official website of the Sri Lanka College of Radiologists. As President, I am privileged to represent a professional body that has consistently upheld excellence in radiology practice, education and research within our nation.",
  "Radiology continues to be at the forefront of modern medicine-guiding diagnosis, influencing therapeutic decisions and shaping the future of patient care. In Sri Lanka, our radiologists remain committed to embracing technical advancements, strengthening subspeciality expertise and maintaining the highest standards of ethical and professional conduct.",
  "The college remains steadfast in its mission to promote continuous professional development, academic excellence and collaborative engagement both locally and internationally. Through scientific meetings, workshops, training programmes and research initiatives we strive to empower our members including trainees to meet demands of contemporary healthcare.",
  "This year marks a particularly significant milestone in our journey - the Silver Jubilee Annual Academic Sessions of the college. Celebrating twenty-five years of dedication to academic advancement and professional unity, this land mark event reflects the remarkable growth and achievements of our college since its inception. The Silver Jubilee Meeting will bring together distinguished local and international faculty, showcase cutting-edge developments in diagnostic and interventional radiology, and provide a vibrant platform for knowledge exchange and scientific discourse.",
  "More importantly this celebration is not only reflection of our past accomplishments but also a reaffirmation of our vision of the future - nurturing the next generation of radiologists strengthening research culture and fostering global partnerships.",
  "I warmly invite all members and trainees to actively participate in this historic event and contribute to making the Silver Jubilee Academic Sessions a memorable and academically enriching experience which will be held on 18th, 19th and 20th of September 2026 at Cinnamon Grand Colombo, Sri Lanka.",
  "As we move forward, let us continue to work together with unity, innovation and commitment to excellence in service of our patients and our profession.",
];

export default function PresidentMessagePage() {
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
                    src="/images/president.png"
                    alt="Dr Nayana Samarasinghe - President, Sri Lanka College of Radiologists"
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
                  Dr Nayana Samarasinghe
                </p>
                <p className="text-white/60 text-sm">The President</p>
                <p className="text-white/60 text-sm">
                  Sri Lanka College of Radiologists
                </p>
              </div>

              <div className="space-y-4 text-white/75 leading-relaxed text-[15px] sm:text-base">
                {MESSAGE_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 text-white/75 text-[15px] sm:text-base">
                <p>With sincere regards,</p>
                <p className="mt-4 font-semibold text-white">
                  Dr Nayana Samarasinghe
                </p>
                <p className="text-white/65">
                  President &ndash; Sri Lanka College of Radiologists &ndash;
                  (2026 &ndash; 2027)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
