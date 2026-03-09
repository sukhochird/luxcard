"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFilterOptions } from "@/lib/use-filter-options";
import type { GiftFilterState } from "@/lib/filterGifts";
import type { GiftCategory, GiftOccasion } from "@/lib/types";
import { defaultGiftFilterState, PRICE_MIN, PRICE_MAX, PRICE_STEP } from "@/lib/filterGifts";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: GiftFilterState;
  onFiltersChange: (f: GiftFilterState) => void;
}

const LOCATION_OPTIONS: { value: GiftFilterState["location"]; label: string }[] = [
  { value: "All", label: "All locations" },
  { value: "Ulaanbaatar", label: "Ulaanbaatar" },
  { value: "Darkhan", label: "Darkhan" },
  { value: "Erdenet", label: "Erdenet" },
];

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const { categories: categoryOptions, occasions: occasionOptions } = useFilterOptions();
  const [open, setOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState(filters.categories);
  const [localOccasions, setLocalOccasions] = useState(filters.occasions);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    filters.priceRange
  );
  const [localLocation, setLocalLocation] = useState(filters.location);

  useEffect(() => {
    setLocalCategories(filters.categories);
    setLocalOccasions(filters.occasions);
    setLocalPriceRange(filters.priceRange);
    setLocalLocation(filters.location);
  }, [filters]);

  const applyFilters = () => {
    onFiltersChange({
      categories: localCategories,
      occasions: localOccasions,
      priceRange: localPriceRange,
      location: localLocation,
    });
    setOpen(false);
  };

  const clearFilters = () => {
    setLocalCategories(defaultGiftFilterState.categories);
    setLocalOccasions(defaultGiftFilterState.occasions);
    setLocalPriceRange(defaultGiftFilterState.priceRange);
    setLocalLocation(defaultGiftFilterState.location);
    onFiltersChange(defaultGiftFilterState);
    setOpen(false);
  };

  const toggleCategory = (cat: GiftCategory) => {
    setLocalCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleOccasion = (occ: GiftOccasion) => {
    setLocalOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const activeCount =
    localCategories.length +
    localOccasions.length +
    (localPriceRange[0] > PRICE_MIN || localPriceRange[1] < PRICE_MAX ? 1 : 0) +
    (localLocation !== "All" ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <Filter className="size-4" />
          Filters
          {activeCount > 0 && (
            <Badge variant="default" className="ml-1 size-5 rounded-full p-0 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((cat) => (
                <label
                  key={cat}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl py-2 pr-2 text-sm transition-colors hover:bg-foreground/5",
                    localCategories.includes(cat) && "bg-foreground/5"
                  )}
                >
                  <Checkbox
                    checked={localCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <span className="text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Occasion
            </label>
            <div className="grid grid-cols-2 gap-2">
              {occasionOptions.map((occ) => (
                <label
                  key={occ.key}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl py-2 pr-2 text-sm transition-colors hover:bg-foreground/5",
                    localOccasions.includes(occ.key) && "bg-foreground/5"
                  )}
                >
                  <Checkbox
                    checked={localOccasions.includes(occ.key)}
                    onCheckedChange={() => toggleOccasion(occ.key)}
                  />
                  <span className="text-foreground">{occ.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Price range: {localPriceRange[0].toLocaleString()}₮ – {localPriceRange[1].toLocaleString()}₮
            </label>
            <Slider
              value={localPriceRange}
              onValueChange={(v) => setLocalPriceRange(v as [number, number])}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              minStepsBetweenThumbs={1}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Location
            </label>
            <Select
              value={localLocation}
              onValueChange={(v) => setLocalLocation(v as GiftFilterState["location"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
