"use client";

import { useState, useCallback, useRef, memo } from "react";
import Image from "next/image";
import { FadeImage } from "@/components/image/FadeImage";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
const CR80_ASPECT = 85.6 / 53.98;

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

function ImageCarouselComponent({ images, alt }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const safeImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const currentSrc = imgErrors[selectedIndex]
    ? PLACEHOLDER_IMAGE
    : safeImages[selectedIndex];

  const handleImageError = useCallback((index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  const go = useCallback(
    (delta: number) => {
      setSelectedIndex((i) =>
        Math.max(0, Math.min(safeImages.length - 1, i + delta))
      );
    },
    [safeImages.length]
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < 40) return;
      if (dx > 0) go(-1);
      else go(1);
    },
    [go]
  );

  return (
    <div className="space-y-4">
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-foreground/5 shadow-lg transition-shadow duration-200 hover:shadow-xl"
        style={{ aspectRatio: CR80_ASPECT }}
        role="region"
        aria-label="Gift card image gallery"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <FadeImage
          key={selectedIndex}
          src={currentSrc}
          alt={`${alt} — image ${selectedIndex + 1} of ${safeImages.length}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-200"
          priority={selectedIndex === 0}
          loading={selectedIndex === 0 ? undefined : "lazy"}
          placeholder={currentSrc.startsWith("/") ? "blur" : "empty"}
          onError={() => handleImageError(selectedIndex)}
        />
      </div>
      {safeImages.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Image thumbnails"
        >
          {safeImages.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`View image ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                i === selectedIndex
                  ? "border-primary shadow-md"
                  : "border-transparent opacity-80 hover:opacity-100 hover:shadow"
              )}
              style={{ aspectRatio: CR80_ASPECT, width: 80, height: 80 / CR80_ASPECT }}
            >
              <Image
                src={imgErrors[i] ? PLACEHOLDER_IMAGE : src}
                alt=""
                fill
                sizes="(max-width: 640px) 25vw, 10vw"
                className="object-cover"
                loading="lazy"
                onError={() => handleImageError(i)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const ImageCarousel = memo(ImageCarouselComponent);
