"use client";

import Image from "next/image";
import Link from "next/link";
import { FALLBACK_BLUR } from "@/lib/blur-constants";
import { cn } from "@/lib/utils";
import { useOccasions } from "@/lib/use-filter-options";

export function PopularOccasions() {
  const { occasions, loading } = useOccasions();
  const displayOccasions = occasions.slice(0, 5);

  return (
    <section
      id="categories"
      className="border-t border-foreground/10 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="occasions-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="occasions-heading"
          className="text-3xl font-bold text-foreground sm:text-4xl"
        >
          Popular occasions
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Find the right gift card for every celebration.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-foreground/10" />
            ))
          ) : (
            displayOccasions.map((occ) => (
              <Link
                key={occ.key}
                href={`/gifts?occasion=${encodeURIComponent(occ.key)}`}
                className={cn(
                  "group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                )}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={occ.image}
                    alt={occ.label}
                    fill
                    placeholder="blur"
                    blurDataURL={FALLBACK_BLUR}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/50 transition-colors duration-300 group-hover:bg-foreground/60" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <span className="text-xl font-bold text-white drop-shadow-md">
                      {occ.label}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
