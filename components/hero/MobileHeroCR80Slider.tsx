"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 50;

/** CR80 card size aspect ratio: 85.6mm × 53.98mm ≈ 1.586 */
const CR80_ASPECT = 85.6 / 53.98;

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=85",
    alt: "Бэлгийн карт",
    href: "/gifts",
  },
  {
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85",
    alt: "Ресторан, кофе шоп",
    href: "/gifts?category=Restaurant",
  },
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=85",
    alt: "Спа, туршлага",
    href: "/gifts?category=Beauty%20%26%20Spa",
  },
];

export function MobileHeroCR80Slider() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const justSwiped = useRef(false);

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      const next = i % SLIDES.length;
      return next < 0 ? next + SLIDES.length : next;
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(index + 1), 5000);
    return () => clearInterval(t);
  }, [index, goTo]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    justSwiped.current = false;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - endX;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        justSwiped.current = true;
        if (diff > 0) goTo(index + 1);
        else goTo(index - 1);
        setTimeout(() => {
          justSwiped.current = false;
        }, 300);
      }
    },
    [index, goTo]
  );

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (justSwiped.current) e.preventDefault();
  }, []);

  return (
    <section
      className="md:hidden"
      aria-label="Онцлох бэлгийн карт"
    >
      <div className="pt-4 pb-2">
        <div
          className="relative w-full overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
            {/* CR80 aspect ratio container */}
            <div
              className="relative w-full"
              style={{ aspectRatio: CR80_ASPECT }}
            >
              {SLIDES.map((slide, i) => (
                <Link
                  key={i}
                  href={slide.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "absolute inset-0 block transition-opacity duration-500",
                    i === index ? "z-0 opacity-100" : "z-[-1] opacity-0"
                  )}
                  aria-hidden={i !== index}
                >
                  <Image
                    src={slide.image}
                    alt={i === index ? slide.alt : ""}
                    fill
                    sizes="100vw"
                    className="object-cover pointer-events-none"
                    priority={i === 0}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" aria-hidden />
                </Link>
              ))}
            </div>

            {/* Dots */}
            <div
              className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5"
              role="tablist"
              aria-label="Слайд сонгох"
            >
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Слайд ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>
      </div>
    </section>
  );
}
