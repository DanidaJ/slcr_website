type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  tone?: "light" | "dark";
};

export default function PageHeader({
  title,
  eyebrow = "The College",
  subtitle,
  tone = "light",
}: PageHeaderProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={`${isDark ? "bg-navy" : "bg-surface"} pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-12`}
    >
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
        {eyebrow && (
          <p
            className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2 ${
              isDark ? "text-white/50" : "text-navy/50"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
            isDark ? "text-white" : "text-navy"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-3 text-sm sm:text-base ${
              isDark ? "text-white/70" : "text-navy/60"
            }`}
          >
            {subtitle}
          </p>
        )}
        <div className="mt-4 w-12 h-0.5 bg-gold" />
      </div>
    </section>
  );
}
