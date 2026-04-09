"use client";

import Image, { ImageProps } from "next/image";
import { useMemo, useState } from "react";

type FallbackImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

export function FallbackImage({ src, fallbackSrc, alt, ...props }: FallbackImageProps) {
  const normalizedSrc = useMemo(() => {
    if (typeof src === "string" && src.trim().length > 0) return src;
    return fallbackSrc;
  }, [src, fallbackSrc]);
  const [activeSrc, setActiveSrc] = useState(normalizedSrc);

  return (
    <Image
      {...props}
      src={activeSrc}
      alt={alt}
      onError={() => {
        if (activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }
      }}
    />
  );
}
