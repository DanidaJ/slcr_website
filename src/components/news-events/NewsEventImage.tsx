import Image from "next/image";
import { COLLEGE_BUILDING_IMAGE } from "@/lib/media";

const FALLBACK = COLLEGE_BUILDING_IMAGE;

type NewsEventImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  /**
   * When true (requires `fill`), shows the full image via object-contain
   * over a blurred, scaled-up object-cover copy of itself, so arbitrary
   * aspect ratios fill the box without cropping.
   */
  letterbox?: boolean;
};

function isRemote(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function NewsEventImage({
  src,
  alt,
  className = "object-cover",
  sizes,
  priority,
  fill,
  width,
  height,
  letterbox = false,
}: NewsEventImageProps) {
  const imageSrc = src?.trim() || FALLBACK;
  const remote = isRemote(imageSrc);
  const fillSizes = sizes ?? "(max-width: 768px) 100vw, 240px";

  if (fill && letterbox) {
    return (
      <>
        <Image
          src={imageSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes={fillSizes}
          className="object-cover scale-125 blur-xl saturate-150"
          unoptimized={remote}
        />
        <div className="absolute inset-0 bg-white/20" />
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`object-contain ${className}`}
          sizes={fillSizes}
          priority={priority}
          unoptimized={remote}
        />
      </>
    );
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes={fillSizes}
        priority={priority}
        unoptimized={remote}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width ?? 320}
      height={height ?? 200}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={remote}
    />
  );
}
