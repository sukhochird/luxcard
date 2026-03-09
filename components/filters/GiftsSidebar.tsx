"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { setCommaParam, parseCommaParam } from "@/lib/gifts-filter-url";
import { useFilterOptions } from "@/lib/use-filter-options";
import type { GiftCategory, GiftOccasion, GiftLocation } from "@/lib/types";
import { PRICE_MIN, PRICE_MAX, PRICE_STEP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Filter, X } from "lucide-react";

const LOCATIONS: { value: "All" | GiftLocation; label: string }[] = [
  { value: "All", label: "Бүх байршил" },
  { value: "Ulaanbaatar", label: "Улаанбаатар" },
  { value: "Darkhan", label: "Дархан" },
  { value: "Erdenet", label: "Эрдэнэт" },
];

function useQueryState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categories = parseCommaParam(searchParams, "category") as GiftCategory[];
  const occasions = parseCommaParam(searchParams, "occasion") as GiftOccasion[];
  const location = (searchParams.get("location") as "All" | GiftLocation) ?? "All";
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const priceRange: [number, number] = [
    priceMin ? parseInt(priceMin, 10) : PRICE_MIN,
    priceMax ? parseInt(priceMax, 10) : PRICE_MAX,
  ];

  const setParams = useCallback(
    (updates: {
      category?: GiftCategory[];
      occasion?: GiftOccasion[];
      location?: "All" | GiftLocation;
      priceMin?: number;
      priceMax?: number;
    }) => {
      const next = new URLSearchParams(searchParams.toString());
      if (updates.category !== undefined) {
        setCommaParam(next, "category", updates.category);
        next.delete("page");
      }
      if (updates.occasion !== undefined) {
        setCommaParam(next, "occasion", updates.occasion);
        next.delete("page");
      }
      if (updates.location !== undefined) {
        if (updates.location === "All") next.delete("location");
        else next.set("location", updates.location);
      }
      if (updates.priceMin !== undefined) {
        if (updates.priceMin === PRICE_MIN) next.delete("priceMin");
        else next.set("priceMin", String(updates.priceMin));
      }
      if (updates.priceMax !== undefined) {
        if (updates.priceMax === PRICE_MAX) next.delete("priceMax");
        else next.set("priceMax", String(updates.priceMax));
      }
      const isFilterChange =
        updates.category !== undefined || updates.occasion !== undefined;
      router.replace(`/gifts?${next.toString()}`, {
        scroll: isFilterChange,
      });
    },
    [router, searchParams]
  );

  const toggleCategory = useCallback(
    (cat: GiftCategory) => {
      const next = categories.includes(cat)
        ? categories.filter((c) => c !== cat)
        : [...categories, cat];
      setParams({ category: next });
    },
    [categories, setParams]
  );

  const toggleOccasion = useCallback(
    (occ: GiftOccasion) => {
      const next = occasions.includes(occ)
        ? occasions.filter((o) => o !== occ)
        : [...occasions, occ];
      setParams({ occasion: next });
    },
    [occasions, setParams]
  );

  const clearAll = useCallback(() => {
    router.replace("/gifts", { scroll: false });
  }, [router]);

  return {
    categories,
    occasions,
    location,
    priceRange,
    setParams,
    toggleCategory,
    toggleOccasion,
    clearAll,
  };
}

type FilterOption = string | { value: string; label: string };

function FilterPill({
  selected,
  onToggle,
  options,
  ariaLabel,
}: {
  selected: string[];
  onToggle: (value: string) => void;
  options: readonly FilterOption[];
  ariaLabel: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const value = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const isSelected = selected.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow",
              isSelected
                ? "border-primary bg-primary text-white"
                : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function SidebarContent() {
  const { categories: categoryOptions, occasions: occasionOptions, loading, error } = useFilterOptions();
  const {
    categories,
    occasions,
    location,
    priceRange,
    setParams,
    toggleCategory,
    toggleOccasion,
    clearAll,
  } = useQueryState();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Шүүлт</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="shrink-0 text-xs"
          aria-label="Бүх шүүлтийг цэвэрлэх"
        >
          Бүгдийг цэвэрлэх
        </Button>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Ангилал
        </label>
        {loading && <p className="mb-1.5 text-xs text-foreground/60">Ачааллаж байна...</p>}
        {error && (
          <p className="mb-1.5 text-xs text-red-600 dark:text-red-400">Ангилал ачааллахад алдаа гарлаа.</p>
        )}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ангилалаар шүүх">
          <button
            type="button"
            onClick={() => setParams({ category: [] })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow",
              categories.length === 0
                ? "border-primary bg-primary text-white"
                : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
            )}
          >
            Бүгд
          </button>
          <FilterPill
            selected={categories}
            onToggle={(v) => toggleCategory(v as GiftCategory)}
            options={categoryOptions}
            ariaLabel=""
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Баяр ёслол
        </label>
        {loading && <p className="mb-1.5 text-xs text-foreground/60">Ачааллаж байна...</p>}
        {error && (
          <p className="mb-1.5 text-xs text-red-600 dark:text-red-400">Баяр ёслол ачааллахад алдаа гарлаа.</p>
        )}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Баяр ёслолоор шүүх">
          <button
            type="button"
            onClick={() => setParams({ occasion: [] })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow",
              occasions.length === 0
                ? "border-primary bg-primary text-white"
                : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
            )}
          >
            Бүгд
          </button>
          <FilterPill
            selected={occasions}
            onToggle={(v) => toggleOccasion(v as GiftOccasion)}
            options={occasionOptions.map((o) => ({ value: o.key, label: o.label }))}
            ariaLabel=""
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Үнэ: {priceRange[0].toLocaleString()}₮ – {priceRange[1].toLocaleString()}₮
        </label>
        <Slider
          value={priceRange}
          onValueChange={(v) =>
            setParams({ priceMin: v[0], priceMax: v[1] })
          }
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          minStepsBetweenThumbs={1}
          aria-label="Үнэ"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Байршил
        </label>
        <Select
          value={location}
          onValueChange={(v) =>
            setParams({ location: v as "All" | GiftLocation })
          }
          aria-label="Байршаар шүүх"
        >
          <SelectTrigger>
            <SelectValue placeholder="Бүх байршил" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function GiftsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="mb-3 flex w-full gap-2 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Шүүлт нээх"
      >
        <Filter className="size-4" />
        Шүүлт
      </Button>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 lg:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[280px] border-r border-foreground/10 bg-background p-4 transition-transform duration-200 lg:static lg:z-auto lg:block lg:translate-x-0 lg:border-0 lg:p-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-foreground/10 pb-2 lg:hidden">
          <span className="font-medium text-sm">Шүүлт</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            aria-label="Шүүлт хаах"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-3 lg:mt-0">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
