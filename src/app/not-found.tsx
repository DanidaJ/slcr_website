"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <section className="min-h-screen bg-navy text-white flex items-center">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase">
          404 Error
        </p>
        <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          Page not found
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/70">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold text-navy font-semibold text-sm cursor-pointer transition-all duration-300 ease-out hover:bg-gold/90 hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-sm cursor-pointer transition-all duration-300 ease-out hover:border-white/70 hover:text-white hover:-translate-y-0.5"
          >
            Back
          </button>
        </div>
      </div>
    </section>
  );
}
