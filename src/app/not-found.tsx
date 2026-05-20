import Link from "next/link";

export default function NotFound() {
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
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-gold/90 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/the-college/past-presidents-message"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-sm hover:border-white/70 hover:text-white transition-colors"
          >
            Past President&apos;s Messages
          </Link>
        </div>
      </div>
    </section>
  );
}
