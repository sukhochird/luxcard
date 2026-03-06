"use client";

import { cn } from "@/lib/utils";
import { OCCASIONS, type Occasion } from "@/lib/data";

interface OccasionChipsProps {
  selected: Occasion | null;
  onSelect: (occasion: Occasion | null) => void;
}

export function OccasionChips({ selected, onSelect }: OccasionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by occasion">
      {OCCASIONS.map((occasion) => (
        <button
          key={occasion}
          type="button"
          onClick={() => onSelect(selected === occasion ? null : occasion)}
          className={cn(
            "rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-200",
            selected === occasion
              ? "border-primary bg-primary text-white shadow-subtle"
              : "border-foreground/20 bg-background text-foreground hover:border-foreground/40 hover:bg-foreground/5"
          )}
        >
          {occasion}
        </button>
      ))}
    </div>
  );
}
