import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PageHeader from "@/components/the-college/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Use | Sri Lanka College of Radiologists",
  description:
    "Terms of use for the Sri Lanka College of Radiologists website and member portal.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: [
      "By accessing or using the Sri Lanka College of Radiologists (SLCR) website, member portal, or related online services, you agree to these Terms of Use. If you do not agree, please do not use the site.",
    ],
  },
  {
    title: "2. About the College",
    body: [
      "The SLCR website provides information about the College, its membership, academic activities, publications, and professional community of radiologists in Sri Lanka.",
      "Content on this site is provided for general information and professional communication. It does not replace clinical judgment or official College correspondence where a signed document is required.",
    ],
  },
  {
    title: "3. Membership and accounts",
    body: [
      "Access to member-only areas requires an approved SLCR membership account.",
      "You are responsible for maintaining the confidentiality of your username and password and for all activity under your account.",
      "You must provide accurate information when registering and notify the College if your contact or professional details change.",
      "The College may suspend or terminate access where an account is misused, where membership status changes, or where these terms are breached.",
    ],
  },
  {
    title: "4. Acceptable use",
    body: [
      "You agree not to misuse the website, attempt unauthorised access, interfere with site operation, upload harmful content, or use member communications for unlawful, abusive, or commercial spam purposes.",
      "Documents, newsletters, and publications made available through the site are for personal and professional use by members and authorised users unless otherwise stated.",
      "You must not reproduce, redistribute, or publish College materials without permission except where clearly permitted by law or by the College.",
    ],
  },
  {
    title: "5. Intellectual property",
    body: [
      "Unless otherwise credited, text, logos, images, publications, and other materials on this site are owned by or licensed to the Sri Lanka College of Radiologists.",
      "You may view and download materials for permitted personal or professional use. Other uses require prior written consent from the College.",
    ],
  },
  {
    title: "6. Third-party services",
    body: [
      "Some features rely on third-party services, including Google sign-in, cloud document storage, and embedded maps or social links.",
      "Your use of those services may be governed by the third party’s own terms and policies.",
    ],
  },
  {
    title: "7. Disclaimer",
    body: [
      "The site and its content are provided on an “as is” and “as available” basis. While we aim to keep information accurate and up to date, the College does not warrant that the site will be uninterrupted, error-free, or complete.",
      "The College is not liable for any loss or damage arising from reliance on website content, temporary unavailability, or technical issues beyond reasonable control.",
    ],
  },
  {
    title: "8. Limitation of liability",
    body: [
      "To the fullest extent permitted by applicable law, the Sri Lanka College of Radiologists shall not be liable for indirect, incidental, or consequential damages arising from use of the website or member portal.",
    ],
  },
  {
    title: "9. Privacy",
    body: [
      "Our collection and use of personal information is described in our Privacy Policy. By using the site, you also agree to that policy.",
    ],
  },
  {
    title: "10. Changes and governing law",
    body: [
      "We may revise these Terms of Use at any time by posting an updated version on this page. Your continued use of the site after changes are posted constitutes acceptance.",
      "These terms are governed by the laws of Sri Lanka. Disputes shall be subject to the jurisdiction of the courts of Sri Lanka.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <main>
      <Navbar transparentOnTop={false} />
      <PageHeader
        title="Terms of Use"
        eyebrow="Legal"
        subtitle="Rules and conditions for using the SLCR website and member services."
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
            <Link href="/privacy-policy" className="font-semibold text-navy hover:text-gold transition-colors">
              Privacy Policy
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
