"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useOccasions } from "@/lib/use-filter-options";

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
      className="border-t-0 bg-background px-4 py-6 sm:px-6 md:border-t md:border-foreground/10 lg:px-8"
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
              Ямар үйл явдлын бэлэг хайж байна вэ?
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

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {featuredOccasion && (
            <Link
              key={`featured-${featuredOccasion.key}`}
              href={`/gifts?occasion=${encodeURIComponent(featuredOccasion.key)}`}
              className="group relative flex shrink-0 snap-center flex-col rounded-2xl border-2 border-primary/40 bg-background shadow-md transition-all duration-200 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="listitem"
              style={{ width: "140px" }}
            >
              <span className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Онцлох
              </span>
              <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-foreground/5">
                <Image
                  src={featuredOccasion.image}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="rounded-b-xl px-2.5 pt-1.5 pb-2 text-center">
                {featuredOccasion.dateLabel && (
                  <span className="block text-xs font-medium text-primary">
                    {featuredOccasion.dateLabel}
                  </span>
                )}
                <span className="block text-sm font-medium text-foreground">
                  {featuredOccasion.label}
                </span>
              </span>
            </Link>
          )}
          {restOccasions.map((occ) => (
            <Link
              key={occ.key}
              href={`/gifts?occasion=${encodeURIComponent(occ.key)}`}
              className="group flex shrink-0 snap-center flex-col rounded-2xl border-2 border-transparent bg-background shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="listitem"
              style={{ width: "140px" }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-foreground/5">
                <Image
                  src={occ.image}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="rounded-b-xl px-2.5 py-2 text-center text-sm font-medium text-foreground">
                {occ.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
