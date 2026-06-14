"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "-60px" } as const;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all backdrop-blur-sm";

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
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const oauthError = errorCode
    ? ERROR_MESSAGES[errorCode] ?? "Sign-in failed. Please try again."
    : null;

  async function handleCredentialLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Sign-in failed. Please try again.");
        return;
      }
      router.push("/?loggedIn=1");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={fadeUp()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="relative overflow-hidden"
    >
      <div className="relative rounded-2xl bg-gradient-to-br from-navy via-navy-dark to-navy overflow-hidden shadow-2xl shadow-navy/20">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/[0.06] blur-3xl pointer-events-none" />
        <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="relative z-10 p-7 sm:p-9">
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
              Sign in with your member email and password, or continue with Google
            </p>
            <div className="mt-3 mx-auto w-10 h-0.5 rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
          </div>

          {(oauthError || formError) && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{formError ?? oauthError}</span>
            </div>
          )}

          <form
            onSubmit={handleCredentialLogin}
            autoComplete="on"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white/80 mb-1.5"
              >
                Username / Email
              </label>
              <input
                id="username"
                name="username"
                type="email"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-white/80 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !username || !password}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold text-navy text-sm font-bold uppercase tracking-wide hover:bg-gold-light disabled:opacity-60 transition-colors duration-300"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-navy-dark px-3 text-xs text-white/35 uppercase tracking-wider">
                or
              </span>
            </div>
          </div>

          <a
            href="/api/auth/google/login"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-sm font-semibold text-navy/80 hover:bg-white/90 hover:shadow-lg transition-all duration-200"
          >
            <GoogleIcon />
            Continue with Google
          </a>

          <div className="mt-7 text-center space-y-3">
            {/* <p className="text-xs leading-relaxed text-white/35">
              Member accounts are created by the College. If you don&apos;t have
              access yet, please{" "}
              <a
                href="/contact-us"
                className="font-semibold text-gold/70 hover:text-gold transition-colors"
              >
                contact us
              </a>
              .
            </p> */}
            <p className="text-xs text-white/35">
              Not a member yet?{" "}
              <a
                href="/membership/register"
                className="font-semibold text-gold/70 hover:text-gold transition-colors"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
