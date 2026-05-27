import type { Metadata } from "next";
import PageHeader from "@/components/the-college/PageHeader";

export const metadata: Metadata = {
  title: "CPD | Sri Lanka College of Radiologists",
  description:
    "National Continuing Professional Development certificate summary and CPD points acquisition guidance.",
};

const ACCORDION_ITEMS = [
  {
    title: "How do I get the NCPDC?",
    items: [
      "Read the Information and Guidance book available at SLMA carefully.",
      "Apply for registration through the registering body.",
      "Engage in CPD activities worth 50 credit points in one year.",
      "Submit your portfolio to the registering body.",
    ],
  },
  {
    title: "Routes to obtain NCPDC",
    items: [
      "Specialist route for specialists via respective professional bodies.",
      "Non specialists affiliated to professional bodies may also use the specialist route if they wish.",
    ],
  },
  {
    title: "Registration",
    items: [
      "Apply in writing to the registering body, eg for Radiologists College of Radiologists, Wijerama Mawatha Colombo 7.",
      "Indicate your core area eg Radiology.",
      "Follow the guide lines as given in the booklet.",
    ],
  },
  {
    title: "Credit Point Scheme",
    items: [
      "Already prepared and published. Please refer 'Guide lines to scoring credit points on different activities'.",
      "Needs to obtain 50 credit points in one year to obtain NCPDC.",
    ],
  },
  {
    title: "Record keeping",
    items: [
      "You should keep your own record of your CPD activities.",
      "According to the 'Guide lines to scoring credit points on different activities' decide to which of the 5 categories any CPD activity belongs to and allocate correct amount of points yourself.",
      "Use A4 size photocopies of sample format to record all activities indicating outcome category number at the top.",
      "Make your portfolio by binding such A4 copies when you finish collecting minimum of 50 points.",
      "Portfolio - Submit your portfolio to the relevant registering body in order to obtain NCPDC - College of Radiologist Wijerama Mawatha Colombo 7.",
      "Refer booklet with guide lines for more details before engaging in the activity.",
    ],
  },
];

export default function CpdPage() {
  return (
    <>
      <PageHeader
        title="CPD"
        eyebrow="Educations"
        subtitle="National Continuing Professional Development Certificate"
      />
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 space-y-12">
          <div className="rounded-2xl border border-navy/15 bg-navy/[0.03] p-6 sm:p-8 shadow-sm shadow-navy/5">
            <h2 className="font-heading text-xl sm:text-2xl text-navy font-bold">
              National Continuing Professional Development Certificate
            </h2>
            <p className="mt-4 text-sm sm:text-base text-navy/70 leading-relaxed">
              Given below is the summarized version of National CPD Certificate
              for easy understanding. SLCR expects you to maintain this document
              as per instruction given below to improve the standards of
              training programme and profession. Academic sessions, workshops,
              local meetings, journal clubs, non routine teaching, web based
              case presentations, postal updates and many more activities done
              day to day are counted.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-navy/15 bg-white p-6 shadow-sm ring-1 ring-navy/5">
              <h3 className="font-heading text-lg text-navy font-bold">
                National CPD Certificate
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-navy/70 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-gold">•</span>
                  <span>
                    Download SVGPerfect for when you want to use just one icon
                    as a vector on the desktop or in your own icon workflow. A
                    common practice among many professional groups world over.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span>
                  <span>
                    SLMA has taken initiative of introduce NCPDC - National
                    Continuing Professional Development Certificate to Sri
                    Lankan doctors to maintain highest professional standards
                    among doctors.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold">•</span>
                  <span>
                    Information and Guidance book is available at SLMA at{" "}
                    <a
                      href="http://issuu.com/slmanews/docs/cpd_info/1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold font-semibold hover:text-gold-light"
                    >
                      http://issuu.com/slmanews/docs/cpd_info/1
                    </a>
                    . It is not compulsory though highly desirable in
                    today&apos;s context as it reflects good professional
                    practice.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-navy/15 bg-white p-6 shadow-sm ring-1 ring-navy/5">
              <h3 className="font-heading text-lg text-navy font-bold">
                Why it matters
              </h3>
              <p className="mt-3 text-sm text-navy/70 leading-relaxed">
                Possessing a valid CPD certificate issued at a national level
                have obvious advantages esp. for PG trainees as a log to produce
                in Pre Board Certification Portfolio assessment (PBCA) and for
                those seeking foreign jobs.
              </p>
              <div className="mt-4 space-y-3 text-sm text-navy/70">
                <div className="rounded-xl border border-gray-100 bg-surface p-4">
                  <p className="font-semibold text-navy">Who awards the CPD?</p>
                  <p className="mt-1">
                    National Center for CPD in Medicine functioning under SLMA
                    awards the certificate.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-surface p-4">
                  <p className="font-semibold text-navy">
                    Who manages the program?
                  </p>
                  <p className="mt-1">
                    NCCPDIM is run by central CPD committee which comprises
                    representatives from all recognized professional bodies in
                    Sri Lanka.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {ACCORDION_ITEMS.map((item) => (
              <details
                key={item.title}
                className="group rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm open:shadow-md transition-shadow"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-navy font-semibold">
                  <span>{item.title}</span>
                  <span className="text-navy/40 group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <ul className="mt-4 space-y-2 text-sm text-navy/70 leading-relaxed">
                  {item.items.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-gold">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          <div className="rounded-2xl border border-navy/15 bg-navy/[0.03] p-6 sm:p-8 shadow-sm shadow-navy/5">
            <h3 className="font-heading text-lg text-navy font-bold">
              CPD Points Acquisition for the Activities Conducted by the College
            </h3>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-sm text-navy/70 border border-navy/15 rounded-xl overflow-hidden bg-white">
                <tbody className="divide-y divide-navy/10">
                  <tr className="align-top">
                    <td className="py-4 px-4 font-semibold text-navy border-r border-navy/10 whitespace-nowrap">
                      OUTCOME NO-1
                    </td>
                    <td className="py-4 px-4 border-r border-navy/10">
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-navy">
                            Designated activities
                          </p>
                          <p className="mt-1 text-navy/70">
                            Academic sessions/regional meetings
                          </p>
                        </div>
                        <div className="pt-3 border-t border-navy/10">
                          <p className="font-semibold text-navy">
                            Non-Designated activities
                          </p>
                          <p className="mt-1 text-navy/70">
                            Local meetings/non routine teaching.
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-r border-navy/10">
                      <div className="space-y-4">
                        <div>
                          <p className="text-navy/70">
                            Resources person-5 hr, 3 /half hr
                          </p>
                          <p className="text-navy/70">
                            Participants-3 /hr 2 points/ half hr
                          </p>
                        </div>
                        <div className="pt-3 border-t border-navy/10">
                          <p className="text-navy/70">
                            Resources person-4 hr, 2 /half hr
                          </p>
                          <p className="text-navy/70">
                            Participants-2 /hr 1 points/ half hr
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-navy whitespace-nowrap">
                      Maximum points - 20
                    </td>
                  </tr>
                  <tr className="align-top bg-navy/[0.03]">
                    <td className="py-4 px-4 font-semibold text-navy border-r border-navy/10 whitespace-nowrap">
                      OUTCOME NO-4
                    </td>
                    <td className="py-4 px-4 border-r border-navy/10">
                      Research and publications
                    </td>
                    <td className="py-4 px-4 border-r border-navy/10">
                      <ul className="space-y-2 leading-relaxed">
                        <li>Recognized Journal - 10 per item.</li>
                        <li>Local journal - 5 per item.</li>
                        <li>Nonprofessional publication - 3 per item.</li>
                      </ul>
                    </td>
                    <td className="py-4 px-4 font-semibold text-navy whitespace-nowrap">
                      Maximum points - 20
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-4 px-4 font-semibold text-navy border-r border-navy/10 whitespace-nowrap">
                      OUTCOME NO-5
                    </td>
                    <td className="py-4 px-4 border-r border-navy/10 text-navy/40">
                      —
                    </td>
                    <td className="py-4 px-4 border-r border-navy/10">
                      <ul className="space-y-2 leading-relaxed">
                        <li>Web based / postal / newsletter - 2 per item.</li>
                        <li>Audit - 5 per item.</li>
                      </ul>
                    </td>
                    <td className="py-4 px-4 font-semibold text-navy whitespace-nowrap">
                      Maximum points - 30
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-navy/70">
              Please refer National CPD Certificate for points acquisition under
              OUTCOME NO 2 &amp; 3.
            </p>
            <p className="mt-2 text-sm text-navy/70">
              Refer SLMA link{" "}
              <a
                href="http://issuu.com/slmanews/docs/cpd_info/1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold font-semibold hover:text-gold-light"
              >
                http://issuu.com/slmanews/docs/cpd_info/1
              </a>{" "}
              for further details of National CPD Certificate.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
