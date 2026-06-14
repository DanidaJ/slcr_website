import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PageHeader from "@/components/the-college/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Sri Lanka College of Radiologists",
  description:
    "Privacy policy for the Sri Lanka College of Radiologists website and member services.",
};

const SECTIONS = [
  {
    title: "1. Who we are",
    body: [
      "The Sri Lanka College of Radiologists (SLCR) operates this website and related member services. Our registered office is at Wijerama House, No 6, Wijerama Road, Colombo 7, Sri Lanka.",
      "If you have questions about this policy, contact us at lankaradiology@yahoo.com or +94-11-2698142.",
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "When you browse the site, we may collect standard technical data such as your browser type, device, and pages visited.",
      "When you register for membership, we collect the details you submit on the application form, including your name, contact details, professional qualifications, and account credentials.",
      "When you sign in, we record authentication events and may store your Google account email if you use Google sign-in.",
      "When you use the member portal, we store messages, correspondence, and related files you send or receive through the College.",
    ],
  },
  {
    title: "3. How we use your information",
    body: [
      "To process membership applications and manage member accounts.",
      "To provide access to member-only content, inbox messages, and correspondence.",
      "To communicate with you about College activities, publications, academic sessions, and administrative matters.",
      "To maintain the security and integrity of the website and member portal.",
      "To comply with legal or regulatory obligations applicable to the College.",
    ],
  },
  {
    title: "4. Legal basis and consent",
    body: [
      "We process membership and account information to perform our relationship with you as a member or applicant of the College.",
      "By submitting a registration form or using member services, you consent to the collection and use of your information as described in this policy.",
    ],
  },
  {
    title: "5. Sharing of information",
    body: [
      "We do not sell your personal information.",
      "We may share information with trusted service providers who help us operate the website, store documents, or deliver email and authentication services. These providers are required to protect your data.",
      "We may disclose information where required by law or to protect the rights, safety, or property of the College, its members, or others.",
    ],
  },
  {
    title: "6. Data retention",
    body: [
      "We retain membership application data, account records, and portal communications for as long as needed to administer membership and meet legal or archival requirements of the College.",
      "You may contact us to request correction of inaccurate information held about you.",
    ],
  },
  {
    title: "7. Security",
    body: [
      "We use reasonable technical and organisational measures to protect personal information, including secure authentication and restricted access to member records.",
      "No online system can be guaranteed completely secure. Please use a strong password and keep your login details confidential.",
    ],
  },
  {
    title: "8. Cookies and similar technologies",
    body: [
      "This site uses cookies and similar technologies for essential functions such as keeping you signed in and remembering session preferences.",
      "Third-party sign-in through Google is subject to Google’s own privacy policy for the data they process during authentication.",
    ],
  },
  {
    title: "9. Links to other websites",
    body: [
      "Our website may link to external sites such as Google Maps, Facebook, or partner organisations. We are not responsible for the privacy practices of those sites.",
    ],
  },
  {
    title: "10. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. The “Last updated” date below will reflect the latest version. Continued use of the site after changes are posted constitutes acceptance of the revised policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar transparentOnTop={false} />
      <PageHeader
        title="Privacy Policy"
        eyebrow="Legal"
        subtitle="How the Sri Lanka College of Radiologists collects, uses, and protects your information."
      />
      <section className="py-10 sm:py-14 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-sm text-navy/50 mb-10">Last updated: 14 June 2026</p>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <article key={section.title}>
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-navy mb-3">
                  {section.title}
                </h2>
                <div className="space-y-3 text-sm sm:text-base text-navy/70 leading-relaxed">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-sm text-navy/60">
            See also our{" "}
            <Link href="/terms-of-use" className="font-semibold text-navy hover:text-gold transition-colors">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  );
}
