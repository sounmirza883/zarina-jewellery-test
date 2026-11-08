"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/config/site";

interface ProductImageProps {
  src: string;
  alt: string;
  /** Tailwind classes for the wrapper, for example "aspect-[4/5]" */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Smooth zoom on hover */
  zoom?: boolean;
}

/** Image with a neutral beige placeholder when the file is missing. */
export function ProductImage({
  src,
  alt,
  className = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  zoom = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-placeholder ${className}`}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gold/70"
        >
          <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M24 6l7 9H17l7-9z" />
            <path d="M17 15l-9 8 16 19 16-19-9-8" />
            <path d="M8 23h32M24 42l-5-19m5 19l5-19" />
          </svg>
          <span className="font-heading text-sm tracking-widest uppercase">{siteConfig.shortName}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          onError={() => setFailed(true)}
          ref={(img) => {
            // Catches images that failed before React attached onError
            if (img && img.complete && img.naturalWidth === 0) setFailed(true);
          }}
          className={`object-cover ${zoom ? "transition-transform duration-500 ease-out group-hover:scale-105" : ""}`}
        />
      )}
    </div>
  );
}
