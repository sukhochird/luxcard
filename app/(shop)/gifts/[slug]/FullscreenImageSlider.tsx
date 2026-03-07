"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface FullscreenImageSliderProps {
  images: string[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
  imgErrors?: Record<number, boolean>;
}

function FullscreenImageSliderComponent({
  images,
  alt,
  initialIndex,
  onClose,
  imgErrors = {},
}: FullscreenImageSliderProps) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const keySyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const hasMultiple = safeImages.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const n = safeImages.length;
    const snap = emblaApi.selectedScrollSnap();
    setSelectedIndex(n > 0 ? snap % n : 0);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi, safeImages.length]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const syncIndex = () => {
      if (!emblaApi) return;
      const n = safeImages.length;
      const snap = emblaApi.selectedScrollSnap();
      setSelectedIndex(n > 0 ? snap % n : 0);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (hasMultiple && emblaApi) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (keySyncTimeout.current) clearTimeout(keySyncTimeout.current);
          scrollPrev();
          keySyncTimeout.current = setTimeout(syncIndex, 100);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          if (keySyncTimeout.current) clearTimeout(keySyncTimeout.current);
          scrollNext();
          keySyncTimeout.current = setTimeout(syncIndex, 100);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (keySyncTimeout.current) clearTimeout(keySyncTimeout.current);
    };
  }, [onClose, hasMultiple, scrollPrev, scrollNext, emblaApi, safeImages.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Thumbnail strip: scroll selected into view
  useEffect(() => {
    if (!hasMultiple) return;
    const el = thumbRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [selectedIndex, hasMultiple]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Зургийн дэлгэц"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Хаах"
      >
        <X className="size-6" />
      </button>

      {hasMultiple && (
        <div className="absolute left-4 top-4 z-20 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {selectedIndex + 1} / {safeImages.length}
        </div>
      )}

      <div
        className="absolute inset-0 cursor-zoom-out"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative flex-1 min-h-0 flex items-center justify-center p-4 pt-16 pb-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="embla__viewport h-full w-full max-h-full overflow-hidden"
          ref={emblaRef}
        >
          <div
            className="embla__container flex h-full touch-pan-y"
            style={{ backfaceVisibility: "hidden", touchAction: "pan-y pinch-zoom" }}
          >
            {safeImages.map((src, i) => (
              <div
                key={i}
                className="embla__slide relative flex shrink-0 grow-0 basis-full items-center justify-center min-w-0 h-full"
              >
                <div className="relative w-full h-full max-h-[85vh]">
                  <Image
                    src={imgErrors[i] ? PLACEHOLDER_IMAGE : src}
                    alt={
                      safeImages.length > 1
                        ? `${alt} — зураг ${i + 1}, нийт ${safeImages.length}`
                        : alt
                    }
                    fill
                    sizes="100vw"
                    className="object-contain"
                    quality={90}
                    priority={i <= initialIndex + 1}
                    loading={i <= initialIndex + 1 ? undefined : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollPrev();
              }}
              aria-label="Өмнөх зураг"
              className={cn(
                "absolute left-2 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-4",
                !canScrollPrev && "pointer-events-none opacity-40"
              )}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollNext();
              }}
              aria-label="Дараагийн зураг"
              className={cn(
                "absolute right-2 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-4",
                !canScrollNext && "pointer-events-none opacity-40"
              )}
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/50 py-3 backdrop-blur-sm">
          <div className="flex justify-center gap-2 overflow-x-auto px-4 scrollbar-thin">
            {safeImages.map((src, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={i}
                  ref={(el) => { thumbRefs.current[i] = el; }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    emblaApi?.scrollTo(i);
                  }}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    isSelected
                      ? "border-white opacity-100"
                      : "border-transparent opacity-60 hover:opacity-90"
                  )}
                  style={{ width: 56, height: 56 }}
                >
                  <Image
                    src={imgErrors[i] ? PLACEHOLDER_IMAGE : src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const FullscreenImageSlider = memo(FullscreenImageSliderComponent);
