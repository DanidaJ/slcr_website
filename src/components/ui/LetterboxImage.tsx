"use client";

import Image from "next/image";

type LetterboxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  imageClassName?: string;
};

/**
 * Shows the full source image (object-contain) over a blurred, scaled-up
 * copy of the same image (object-cover) so arbitrary aspect ratios never
 * get cropped, while still filling a fixed-size container.
 */
export default function LetterboxImage({
  src,
  alt,
  sizes,
  imageClassName = "",
}: LetterboxImageProps) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="object-cover scale-125 blur-xl saturate-150"
      />
      <div className="absolute inset-0 bg-white/20" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-contain ${imageClassName}`}
      />
    </>
  );
}
