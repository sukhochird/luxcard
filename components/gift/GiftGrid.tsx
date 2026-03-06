"use client";

import { useMemo, useState } from "react";
import { GiftCard } from "./GiftCard";
import { TopControlBar, type SortOption } from "./TopControlBar";
import { EmptyState } from "./EmptyState";
import type { Gift } from "@/lib/types";

function sortGifts(gifts: Gift[], sort: SortOption): Gift[] {
  const copy = [...gifts];
  switch (sort) {
    case "price-asc":
      return copy.sort(
        (a, b) => Math.min(...a.priceOptions) - Math.min(...b.priceOptions)
      );
    case "price-desc":
      return copy.sort(
        (a, b) => Math.min(...b.priceOptions) - Math.min(...a.priceOptions)
      );
    case "newest":
      return copy.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    case "popular":
    default:
      return copy.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

interface GiftGridProps {
  gifts: Gift[];
}

export function GiftGrid({ gifts }: GiftGridProps) {
  const [sort, setSort] = useState<SortOption>("popular");
  const sortedGifts = useMemo(() => sortGifts(gifts, sort), [gifts, sort]);

  if (gifts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <TopControlBar
        resultCount={sortedGifts.length}
        sort={sort}
        onSortChange={setSort}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedGifts.map((item, index) => (
          <GiftCard
            key={item.id}
            item={item}
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}
