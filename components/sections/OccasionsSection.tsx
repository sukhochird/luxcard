"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Gift, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOccasions } from "@/lib/use-filter-options";
import type { OccasionOption } from "@/lib/types";

/** Fixed height for all occasion card images so the row is uniform */
const CARD_IMAGE_H = 140;
const CARD_WIDTH = 140;

/** Accent used for image fallback gradient (primary tint) */
const FALLBACK_GRADIENT = "linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.06) 100%)";

function OccasionCardImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`absolute inset-0 ${className ?? ""}`}
        style={{ background: FALLBACK_GRADIENT }}
        aria-hidden
      >
        <Gift className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-primary/50" aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={`${CARD_WIDTH}px`}
      className={className}
      onError={() => setError(true)}
    />
  );
}

function OccasionCard({
  occasion,
  featured = false,
  cardImageH,
  cardWidth,
}: {
  occasion: OccasionOption;
  featured?: boolean;
  cardImageH: number;
  cardWidth: number;
}) {
  return (
    <Link
      href={`/gifts?occasion=${encodeURIComponent(occasion.key)}`}
      className={cn(
        "group relative flex w-full min-w-0 max-w-full shrink-0 snap-center flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        featured
          ? "border-2 border-primary/40 hover:border-primary hover:shadow-lg"
          : "border-[#e5e5e5] dark:border-foreground/20 hover:border-primary/40 hover:shadow-md"
      )}
      role="listitem"
      style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth }}
    >
      {featured && (
        <span
          className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm"
          title="Энэ сарын онцлон харуулсан үйл явдал"
        >
          Онцлох
        </span>
      )}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-t-xl bg-foreground/5"
        style={{ height: cardImageH }}
      >
        <OccasionCardImage
          src={occasion.image}
          alt=""
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-[2.75rem] w-full flex-col justify-center overflow-hidden rounded-b-xl px-2.5 py-2 text-center">
        {occasion.dateLabel && (
          <span className="mb-0.5 inline-flex w-full items-center justify-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            <Calendar className="size-3 shrink-0" aria-hidden />
            {occasion.dateLabel}
          </span>
        )}
        <span
          className="block truncate text-sm font-medium text-foreground"
          title={occasion.label}
        >
          {occasion.label}
        </span>
      </div>
    </Link>
  );
}

export function OccasionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { occasions } = useOccasions();
  const featuredOccasion = occasions.find((o) => o.featured);
  const restOccasions = occasions.filter((o) => !o.featured);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = 160;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="occasions"
      className="bg-background px-4 py-6 sm:px-6 lg:px-8"
      aria-labelledby="occasions-heading"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2
              id="occasions-heading"
              className="text-xl font-bold text-foreground sm:text-2xl"
            >
              Баяр ёслол
            </h2>
            <p className="mt-0.5 text-sm text-foreground/70">
              Үйл явдлаа сонгоод тохирох бэлгийг ол
            </p>
          </div>
          <div className="flex shrink-0 gap-1" aria-hidden="true">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Зүүн тийш гүйлгэх"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Баруун тийш гүйлгэх"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </header>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 pr-20 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="list"
          >
            {featuredOccasion && (
              <OccasionCard
                occasion={featuredOccasion}
                featured
                cardImageH={CARD_IMAGE_H}
                cardWidth={CARD_WIDTH}
              />
            )}
            {restOccasions.map((occ) => (
              <OccasionCard
                key={occ.key}
                occasion={occ}
                cardImageH={CARD_IMAGE_H}
                cardWidth={CARD_WIDTH}
              />
            ))}
          </div>
          {/* Right-side fade to signal more content */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
