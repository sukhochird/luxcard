"use client";

import { cn } from "@/lib/utils";
import { useOccasions } from "@/lib/use-filter-options";
import type { GiftOccasion } from "@/lib/types";

interface OccasionChipsProps {
  selected: GiftOccasion | null;
  onSelect: (occasion: GiftOccasion | null) => void;
}

export function OccasionChips({ selected, onSelect }: OccasionChipsProps) {
  const { occasions } = useOccasions();
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by occasion">
      {occasions.map((occ) => (
        <button
          key={occ.key}
          type="button"
          onClick={() => onSelect(selected === occ.key ? null : occ.key)}
          className={cn(
            "rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-200",
            selected === occ.key
              ? "border-primary bg-primary text-white shadow-subtle"
              : "border-foreground/20 bg-background text-foreground hover:border-foreground/40 hover:bg-foreground/5"
          )}
        >
          {occ.label}
        </button>
      ))}
    </div>
  );
}
