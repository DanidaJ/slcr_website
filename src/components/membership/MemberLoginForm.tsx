"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "-60px" } as const;

/** Maps callback `?error=` codes to member-friendly messages. */
const ERROR_MESSAGES: Record<string, string> = {
  unauthorized:
    "This Google account isn’t authorized. Member accounts are created by the College — please contact us if you believe this is a mistake.",
  unverified:
    "Your Google email address isn’t verified. Verify it with Google and try again.",
  google: "Google sign-in didn’t complete. Please try again.",
  state: "Your sign-in session expired. Please try again.",
  invalid: "Your sign-in session expired. Please try again.",
  expired: "Your sign-in session expired. Please try again.",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function MemberLoginForm({ errorCode }: { errorCode?: string }) {
  const error = errorCode
    ? ERROR_MESSAGES[errorCode] ?? "Sign-in failed. Please try again."
    : null;

  return (
    <motion.div
      variants={fadeUp()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="relative overflow-hidden"
    >
      {/* Background card with gradient border effect */}
      <div className="relative rounded-2xl bg-gradient-to-br from-navy via-navy-dark to-navy overflow-hidden shadow-2xl shadow-navy/20">
        {/* Decorative glow spots */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/[0.06] blur-3xl pointer-events-none" />

        {/* Gold top accent line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="relative z-10 p-7 sm:p-9">
          {/* Logo & heading */}
          <div className="flex justify-center mb-5">
            <div className="p-3 rounded-2xl bg-white/[0.08] ring-1 ring-white/[0.08] backdrop-blur-sm">
              <Image
                src="/images/logo.png"
                alt="SLCR"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
              Member Sign In
            </h2>
            <p className="mt-2 text-sm text-white/45">
              Use the Google account registered with the College
            </p>
            <div className="mt-3 mx-auto w-10 h-0.5 rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
          </div>

          {/* Error banner (from the OAuth callback redirect) */}
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google sign-in — kicks off the OAuth flow on the server */}
          <a
            href="/api/auth/google/login"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-sm font-semibold text-navy/80 hover:bg-white/90 hover:shadow-lg transition-all duration-200"
          >
            <GoogleIcon />
            Continue with Google
          </a>

          <div className="mt-7 text-center">
            <p className="text-xs leading-relaxed text-white/35">
              Member accounts are created by the College. If you don&apos;t have
              access yet, please{" "}
              <a
                href="/contact-us"
                className="font-semibold text-gold/70 hover:text-gold transition-colors"
              >
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
