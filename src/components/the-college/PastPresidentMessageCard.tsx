import Link from "next/link";
import PortraitImage from "@/components/ui/PortraitImage";
import { resolvePresidentImage } from "@/lib/presidentImages";

type PastPresidentMessageCardProps = {
  name: string;
  excerpt: string;
  href: string;
  image: string;
};

export default function PastPresidentMessageCard({
  name,
  excerpt,
  href,
  image,
}: PastPresidentMessageCardProps) {
  const src = resolvePresidentImage(image);

  return (
    <article className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-surface">
        <PortraitImage
          src={src}
          alt={name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="font-heading text-lg text-navy font-bold leading-snug">
          {name}
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
          {excerpt}
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-navy text-navy text-sm font-semibold rounded hover:bg-navy hover:text-white transition-colors"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}
