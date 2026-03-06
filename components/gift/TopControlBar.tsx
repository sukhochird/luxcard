"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { GiftCategory, GiftOccasion, GiftLocation } from "@/lib/types";

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

interface TopControlBarProps {
  resultCount: number;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

function useActiveFilters(): {
  active: { type: "category" | "occasion" | "location"; label: string }[];
  searchParams: URLSearchParams;
} {
  const searchParams = useSearchParams();
  const categories = searchParams.getAll("category") as GiftCategory[];
  const occasions = searchParams.getAll("occasion") as GiftOccasion[];
  const location = searchParams.get("location") as "All" | GiftLocation | null;
  const active: { type: "category" | "occasion" | "location"; label: string }[] = [];
  categories.forEach((c) => active.push({ type: "category", label: c }));
  occasions.forEach((o) => active.push({ type: "occasion", label: o }));
  if (location && location !== "All")
    active.push({ type: "location", label: location });
  return { active, searchParams };
}

function buildUrlWithoutFilter(
  searchParams: URLSearchParams,
  type: "category" | "occasion" | "location",
  value: string
): string {
  const next = new URLSearchParams(searchParams.toString());
  if (type === "location") {
    next.delete("location");
  } else {
    const key = type === "category" ? "category" : "occasion";
    const values = next.getAll(key).filter((v) => v !== value);
    next.delete(key);
    values.forEach((v) => next.append(key, v));
  }
  const q = next.toString();
  return q ? `/gifts?${q}` : "/gifts";
}

export function TopControlBar({ resultCount, sort, onSortChange }: TopControlBarProps) {
  const { active: activeFilters, searchParams } = useActiveFilters();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm text-foreground/70">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map(({ type, label }) => (
              <Link
                key={`${type}-${label}`}
                href={buildUrlWithoutFilter(searchParams, type, label)}
                className="inline-flex items-center gap-1 rounded-full border border-foreground/20 bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Remove ${label} filter`}
              >
                {label}
                <X className="size-3" />
              </Link>
            ))}
          </div>
        )}
      </div>
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)} aria-label="Sort results">
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
