"use client";

import { useState } from "react";
import Image from "next/image";

type CouncilMemberImageProps = {
  name: string;
  position?: string;
  imageUrl: string | null;
  placeholderUrl: string;
};

export default function CouncilMemberImage({
  name,
  position,
  imageUrl,
  placeholderUrl,
}: CouncilMemberImageProps) {
  const [src, setSrc] = useState(imageUrl ?? placeholderUrl);
  const alt = position
    ? `${name} — ${position}, Sri Lanka College of Radiologists`
    : `${name} — Council Member, Sri Lanka College of Radiologists`;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      loading="lazy"
      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      onError={() => {
        if (src !== placeholderUrl) setSrc(placeholderUrl);
      }}
    />
  );
}
