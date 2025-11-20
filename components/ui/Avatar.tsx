"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt: string;
}

export function Avatar({ src, alt }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || "/userAvatar.jpg"}
      alt={alt}
      fill
      className="object-cover overflow-hidden rounded-[50%]"
      onError={() => setImgSrc("/userAvatar.jpg")}
    />
  );
}
