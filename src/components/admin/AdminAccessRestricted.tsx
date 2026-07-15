import Link from "next/link";

/**
 * Shown when an unauthenticated visitor hits an /admin/* route.
 * Layout mirrors the site 404 screen for consistent empty-state UX.
 */
export default function AdminAccessRestricted() {
  return (
    <section className="flex-1 bg-navy text-white flex items-center">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase">
          Restricted
        </p>
        <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          Access Restricted
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
          This area is only available to College administrators. If you have an
          admin account, sign in with your membership credentials first.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold text-navy font-semibold text-sm cursor-pointer transition-all duration-300 ease-out hover:bg-gold/90 hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
          <Link
            href="/membership/member-login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-sm cursor-pointer transition-all duration-300 ease-out hover:border-white/70 hover:text-white hover:-translate-y-0.5"
          >
            Member Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
