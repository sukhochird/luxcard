"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullscreenImageSlider } from "./FullscreenImageSlider";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
const CR80_ASPECT = 85.6 / 53.98;
const THUMB_SIZE = 72;

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

function ImageCarouselComponent({ images, alt }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const safeImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const hasMultiple = safeImages.length > 1;
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const keySyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

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
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Thumbnail strip: scroll selected into view
  useEffect(() => {
    if (!hasMultiple) return;
    const el = thumbRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [selectedIndex, hasMultiple]);

  const handleImageError = useCallback((index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Keyboard navigation + sync thumbnail after scroll (after animation settles)
  useEffect(() => {
    const syncIndex = () => {
      if (!emblaApi) return;
      const n = safeImages.length;
      const snap = emblaApi.selectedScrollSnap();
      setSelectedIndex(n > 0 ? snap % n : 0);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!hasMultiple || !emblaApi) return;
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
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (keySyncTimeout.current) clearTimeout(keySyncTimeout.current);
    };
  }, [hasMultiple, scrollPrev, scrollNext, emblaApi, safeImages.length]);

  return (
    <div className="space-y-4">
      {fullscreenOpen && (
        <FullscreenImageSlider
          images={safeImages}
          alt={alt}
          initialIndex={selectedIndex}
          onClose={() => setFullscreenOpen(false)}
          imgErrors={imgErrors}
        />
      )}
      <div
        className="group relative w-full overflow-hidden rounded-2xl bg-foreground/5 shadow-lg ring-1 ring-foreground/5 transition-all duration-300 hover:shadow-xl hover:ring-foreground/10"
        style={{ aspectRatio: CR80_ASPECT }}
        role="region"
        aria-label="Зургийн галерей"
      >
        <div className="embla__viewport overflow-hidden rounded-2xl" ref={emblaRef}>
          <div
            className="embla__container flex touch-pan-y"
            style={{ backfaceVisibility: "hidden", touchAction: "pan-y pinch-zoom" }}
          >
            {safeImages.map((src, i) => (
              <div
                key={i}
                className="embla__slide relative shrink-0 grow-0 basis-full min-w-0"
                style={{ aspectRatio: CR80_ASPECT }}
              >
                <div className="absolute inset-0 bg-foreground/5">
                  <Image
                    src={imgErrors[i] ? PLACEHOLDER_IMAGE : src}
                    alt={
                      safeImages.length > 1
                        ? `${alt} — зураг ${i + 1}, нийт ${safeImages.length}`
                        : alt
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    priority={i === 0}
                    loading={i === 0 ? undefined : "lazy"}
                    onError={() => handleImageError(i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenOpen(true);
          }}
          aria-label="Дэлгэц дүүргэж үзэх"
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-foreground/70 text-white backdrop-blur-sm transition-colors hover:bg-foreground/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:right-4 md:top-4"
        >
          <Maximize2 className="size-5" />
        </button>
        {hasMultiple && (
          <>
            <div
              className="absolute right-3 top-14 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
              aria-hidden
            >
              {selectedIndex + 1} / {safeImages.length}
            </div>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Өмнөх зураг"
              className={cn(
                "absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "hover:bg-white hover:shadow-lg active:scale-95 md:left-3",
                "md:opacity-0 md:group-hover:opacity-100",
                !canScrollPrev && "pointer-events-none opacity-40"
              )}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Дараагийн зураг"
              className={cn(
                "absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "hover:bg-white hover:shadow-lg active:scale-95 md:right-3",
                "md:opacity-0 md:group-hover:opacity-100",
                !canScrollNext && "pointer-events-none opacity-40"
              )}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-smooth">
          {safeImages.map((src, i) => (
            <button
              key={i}
              ref={(el) => { thumbRefs.current[i] = el; }}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Зураг ${i + 1} үзэх`}
              onClick={() => scrollTo(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                i === selectedIndex
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-foreground/20"
              )}
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE / CR80_ASPECT,
                minWidth: THUMB_SIZE,
              }}
            >
              <Image
                src={imgErrors[i] ? PLACEHOLDER_IMAGE : src}
                alt=""
                fill
                sizes="72px"
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
