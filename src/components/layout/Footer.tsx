import Link from "next/link";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const QUICK_LINKS = [
  { label: "Ministry of Health", href: "https://www.health.gov.lk/" },
  { label: "Epidemiology Unit", href: "https://www.epid.gov.lk/" },
  { label: "Medical Research Institute", href: "https://www.mri.gov.lk/" },
  {
    label: "National Medicines Regulatory Authority",
    href: "https://www.nmra.gov.lk/",
  },
];

const MAPS_LINK = "https://maps.app.goo.gl/Lg2L8QPTituK7VbF7";
const FACEBOOK_LINK = "https://www.facebook.com/570661699637887?ref=embed_page";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/75">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-2 font-heading">
              About
            </h3>
            <div className="w-8 h-0.5 bg-gold mb-5" />
            <p className="text-white/55 text-sm leading-relaxed">
              Members, specially those serving in the periphery, have brought in
              a vast amount of strength to our college in silence over the
              years, making it one of the strongest academic bodies in the
              medical field.
            </p>
          </div>

          {/* Office */}
          <div>
            <h3 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-2 font-heading">
              Office
            </h3>
            <div className="w-8 h-0.5 bg-gold mb-5" />
            <div className="space-y-4 text-sm">
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 text-white/55 hover:text-white transition-all duration-300 ease-out"
              >
                <MapPin className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 mt-0.5 transition-all duration-300 ease-out" />
                <span>
                  Sri Lanka College of Radiologists
                  <br />
                  Wijerama House,
                  <br />
                  No 6, Wijerama Road,
                  <br />
                  Colombo 7, Sri Lanka
                </span>
              </a>
              <div className="w-full h-px bg-white/10" />
              <a
                href="tel:+94112698142"
                className="group flex items-center gap-3 text-white/55 hover:text-white transition-all duration-300 ease-out"
              >
                <Phone className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 transition-all duration-300 ease-out" />
                <span>
                  +94-11-2698142
                </span>
              </a>
              <div className="w-full h-px bg-white/10" />
              <a
                href="mailto:lankaradiology@yahoo.com"
                className="group flex items-center gap-3 text-white/55 hover:text-white transition-all duration-300 ease-out"
              >
                <Mail className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 transition-all duration-300 ease-out" />
                <span>
                  lankaradiology@yahoo.com
                </span>
              </a>
              <div className="w-full h-px bg-white/10" />
              <a
                href={FACEBOOK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-white/55 hover:text-white transition-all duration-300 ease-out"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 fill-current transition-all duration-300 ease-out"
                >
                  <path d="M13.5 22v-8.1h2.7l.4-3.2h-3.1V8.7c0-.9.2-1.5 1.5-1.5H16.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.2v3.2H10V22h3.5Z" />
                </svg>
                <span>
                  Facebook
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-2 font-heading">
              Quick Links
            </h3>
            <div className="w-8 h-0.5 bg-gold mb-5" />
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-white/55 hover:text-white text-sm transition-all duration-300 ease-out hover:translate-x-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-all duration-300 ease-out shrink-0 mt-0.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-white/35 text-xs">
            © 2026 Sri Lanka College of Radiologists. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/35">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-all duration-300 ease-out">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
