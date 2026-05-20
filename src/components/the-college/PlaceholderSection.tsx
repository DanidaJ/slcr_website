type PlaceholderSectionProps = {
  message?: string;
};

export default function PlaceholderSection({
  message = "Content will be added soon.",
}: PlaceholderSectionProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          {message}
        </p>
      </div>
    </section>
  );
}
