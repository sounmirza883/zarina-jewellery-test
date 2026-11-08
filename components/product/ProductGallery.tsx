"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

interface ProductGalleryProps {
  name: string;
  images: string[];
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const list = images.length > 0 ? images : [""];
  const current = list[Math.min(active, list.length - 1)] ?? "";

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div>
      <div
        className="relative cursor-zoom-in overflow-hidden"
        onMouseMove={onMove}
        onMouseLeave={() => setZoomPos(null)}
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={
            zoomPos
              ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
        >
          <ProductImage
            key={current}
            src={current}
            alt={`${name}, view ${active + 1} of ${list.length}`}
            className="aspect-[4/5]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={active === 0}
          />
        </div>
      </div>

      {list.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {list.map((src, i) => (
            <li key={`${src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Show image ${i + 1} of ${list.length}`}
                className={`block min-h-11 min-w-11 w-16 overflow-hidden rounded-sm border-2 transition-colors sm:w-20 ${
                  i === active ? "border-gold" : "border-transparent hover:border-line"
                }`}
              >
                <ProductImage
                  src={src}
                  alt=""
                  className="aspect-[4/5]"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
