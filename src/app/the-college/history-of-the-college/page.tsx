import Image from "next/image";
import PageHeader from "@/components/the-college/PageHeader";

export default function HistoryOfTheCollegePage() {
  return (
    <>
      <PageHeader title="History of the College" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/images/college-building.jpg"
                alt="Sri Lanka College of Radiologists Building"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-4 text-gray-600 text-[15px] sm:text-base leading-relaxed">
              <p>The College of Radiologists was established in January 1980.</p>
              <p>
                It was renamed Sri Lanka College of Radiologists in the latter
                part of 2004, to meet the requirements of the constitutional
                changes that took place during that period.
              </p>
              <p>
                Thus the Sri Lanka College of Radiologists has been representing
                both disciplines of Clinical Radiology and Radiation Oncology
                with the main objective being the training of competent
                Radiologists, Radiotherapists working closely with the Post
                Graduate Institute of Medicine, in order to meet the demands in
                the country.
              </p>
              <p>
                Since its inception , the College, in conjunction with the
                Postgraduate Institute of Medicine, University of Colombo, has
                produced, large number of Clinical Radiologists and Clinical
                Oncologists.The membership of the College now (July 2013) stands
                at 331.
              </p>
              <p>
                Currently the Sri Lanka College of Radiologists remains the only
                Body, supervising and managing the professional standards of the
                Radiologists practicing in Sri Lanka, holding Academic
                activities locally and facilitating and encouraging members to
                participate in the Academic activities overseas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
