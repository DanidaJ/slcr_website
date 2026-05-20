import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import PageHeader from "@/components/the-college/PageHeader";

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=Sri%20Lanka%20College%20of%20Radiologists%2C%20Colombo%207&output=embed";

export default function ContactUsPage() {
  return (
    <main>
      <Navbar transparentOnTop={false} />
      <PageHeader title="Contact Us" eyebrow="Get in Touch" tone="dark" />
      <section className="py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-6">
              <div className="rounded-2xl border border-navy/10 bg-white shadow-sm p-6 sm:p-7">
                <p className="text-navy/50 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                  Our Address
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold">
                  Sri Lanka College of Radiologists
                </h2>
                <div className="mt-4 w-12 h-0.5 bg-gold" />
                <div className="mt-4 text-sm sm:text-base text-navy/70 leading-relaxed">
                  <p>Wijerama House,</p>
                  <p>No 6, Wijerama Road,</p>
                  <p>Colombo 7, Sri Lanka</p>
                </div>
                <div className="mt-4 space-y-2 text-sm text-navy/70">
                  <p>
                    <span className="font-semibold text-navy">Telephone:</span>{" "}
                    <a
                      href="tel:+94112698142"
                      className="text-navy/70 hover:text-navy transition-colors"
                    >
                      +94-11-2698142
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-navy">Email:</span>{" "}
                    <a
                      href="mailto:lankaradiology@yahoo.com"
                      className="text-navy/70 hover:text-navy transition-colors"
                    >
                      lankaradiology@yahoo.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-navy/10 bg-white shadow-sm p-4 sm:p-5">
                <div className="relative w-full h-80 rounded-xl overflow-hidden">
                  <iframe
                    title="Sri Lanka College of Radiologists map"
                    src={MAP_EMBED_URL}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-xs text-navy/60">
                  View on{" "}
                  <a
                    href="https://maps.app.goo.gl/Lg2L8QPTituK7VbF7"
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy hover:text-navy-dark font-semibold transition-colors"
                  >
                    Google Maps
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-navy/10 bg-white shadow-sm p-6 sm:p-7">
              <p className="text-navy/50 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                Send us a message
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold">
                Let&apos;s connect
              </h2>
              <p className="mt-2 text-sm sm:text-base text-navy/70">
                Fill in the form and we&apos;ll get back to you shortly.
              </p>
              <div className="mt-4 w-12 h-0.5 bg-gold" />

              <form className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-navy"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-navy"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-navy"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Enter your subject"
                    className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-navy"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Write your message here"
                    className="mt-2 w-full rounded-lg border border-navy/10 px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-dark transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  );
}
