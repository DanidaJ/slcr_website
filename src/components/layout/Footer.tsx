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
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white transition-colors leading-relaxed"
                >
                  Sri Lanka College of Radiologists
                  <br />
                  Wijerama House,
                  <br />
                  No 6, Wijerama Road,
                  <br />
                  Colombo 7, Sri Lanka
                </a>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                <a
                  href="tel:+94112698142"
                  className="text-white/55 hover:text-white transition-colors"
                >
                  +94-11-2698142
                </a>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                <a
                  href="mailto:lankaradiology@yahoo.com"
                  className="text-white/55 hover:text-white transition-colors"
                >
                  lankaradiology@yahoo.com
                </a>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-white/40 flex-shrink-0" />
                <a
                  href={FACEBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </div>
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
                    className="group flex items-start gap-2 text-white/55 hover:text-white text-sm transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors flex-shrink-0 mt-0.5" />
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
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
