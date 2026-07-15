import Image from "next/image";
import { isLocalStaticImage } from "@/lib/presidentImages";

type PortraitImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

/** Full portrait on a neutral background — no coloured letterbox blur. */
export default function PortraitImage({
  src,
  alt,
  sizes,
  className = "object-top",
}: PortraitImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={isLocalStaticImage(src)}
      className={`object-contain ${className}`}
    />
  );
}
