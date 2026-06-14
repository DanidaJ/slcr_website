import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const MAPS_LINK = "https://maps.app.goo.gl/Lg2L8QPTituK7VbF7";
const FACEBOOK_LINK = "https://www.facebook.com/570661699637887?ref=embed_page";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/75">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* About */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-xs tracking-[0.2em] uppercase font-heading">
              About
            </h3>
            <div className="w-8 h-0.5 bg-gold mt-3 mb-5" />
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              Members, specially those serving in the periphery, have brought in
              a vast amount of strength to our college in silence over the
              years, making it one of the strongest academic bodies in the
              medical field.
            </p>
          </div>

          {/* Office */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-xs tracking-[0.2em] uppercase font-heading">
              Office
            </h3>
            <div className="w-8 h-0.5 bg-gold mt-3 mb-5" />
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 text-sm text-white/55 hover:text-white transition-colors duration-300"
            >
              <MapPin className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 mt-0.5 transition-colors duration-300" />
              <span className="leading-relaxed">
                Sri Lanka College of Radiologists
                <br />
                Wijerama House,
                <br />
                No 6, Wijerama Road,
                <br />
                Colombo 7, Sri Lanka
              </span>
            </a>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-xs tracking-[0.2em] uppercase font-heading">
              Contact Us
            </h3>
            <div className="w-8 h-0.5 bg-gold mt-3 mb-5" />
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="tel:+94112698142"
                  className="group flex items-start gap-3 text-white/55 hover:text-white transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 mt-0.5 transition-colors duration-300" />
                  <span>+94-11-2698142</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:lankaradiology@yahoo.com"
                  className="group flex items-start gap-3 text-white/55 hover:text-white transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 mt-0.5 transition-colors duration-300" />
                  <span>lankaradiology@yahoo.com</span>
                </a>
              </li>
              <li>
                <a
                  href={FACEBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-white/55 hover:text-white transition-colors duration-300"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white/40 group-hover:text-white shrink-0 mt-0.5 fill-current transition-colors duration-300"
                  >
                    <path d="M13.5 22v-8.1h2.7l.4-3.2h-3.1V8.7c0-.9.2-1.5 1.5-1.5H16.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.2v3.2H10V22h3.5Z" />
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-white/35 text-xs leading-relaxed">
            © 2026 Sri Lanka College of Radiologists. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/35">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors duration-300">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
