import Image from "next/image";

const FALLBACK = "/images/college-building.jpg";

type NewsEventImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
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
}: NewsEventImageProps) {
  const imageSrc = src?.trim() || FALLBACK;
  const remote = isRemote(imageSrc);

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? "(max-width: 768px) 100vw, 240px"}
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
