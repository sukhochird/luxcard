"use client";

import { memo, useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Package } from "lucide-react";
import type { PackagingId } from "@/lib/types";
import { cn } from "@/lib/utils";
import packagingData from "@/data/packaging.json";

export type { PackagingId };

export type PackagingCategory = "all" | "boxes" | "bags" | "accessories";

export interface PackagingProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: PackagingCategory;
}

const CATEGORY_LABELS: Record<PackagingCategory, string> = {
  all: "Бүгд",
  boxes: "Хайрцаг",
  bags: "Уут",
  accessories: "Дагалдах",
};

const PACKAGING_PRODUCTS = packagingData as PackagingProduct[];

function PackagingImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 text-foreground/40" aria-hidden>
        <Package className="size-10" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
      className="object-cover"
      onError={() => setErr(true)}
    />
  );
}

export function getPackagingModifier(id: PackagingId): number {
  return PACKAGING_PRODUCTS.find((o) => o.id === id)?.price ?? 0;
}

export function getAddonsModifier(addons: PackagingId[]): number {
  return addons.reduce((sum, id) => sum + getPackagingModifier(id), 0);
}

interface PackagingSelectionProps {
  value: PackagingId[];
  onChange: (ids: PackagingId[]) => void;
}

const IMAGE_HEIGHT = 140;

function PackagingSelectionComponent({ value, onChange }: PackagingSelectionProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState<PackagingCategory>("all");
  const selectedSet = useMemo(() => new Set(value), [value]);

  useEffect(() => setMounted(true), []);
  const totalModifier = useMemo(() => getAddonsModifier(value), [value]);
  const selectedProducts = useMemo(
    () => PACKAGING_PRODUCTS.filter((p) => selectedSet.has(p.id as PackagingId)),
    [selectedSet]
  );
  const filteredProducts = useMemo(
    () =>
      category === "all"
        ? PACKAGING_PRODUCTS
        : PACKAGING_PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  const toggle = (id: PackagingId) => {
    if (selectedSet.has(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <>
      <fieldset className="space-y-3 border-0 p-0 m-0 min-w-0">
        <legend className="mb-0 block px-0 text-xs font-medium uppercase tracking-wider text-foreground/60">
          Бэлэглэл <span className="normal-case font-normal">(заавал биш)</span>
        </legend>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150",
            "border-foreground/20 bg-background hover:border-foreground/40 hover:bg-foreground/[0.02]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          aria-label="Бэлэглэл сонгох"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="flex min-w-0 flex-1 items-center gap-3">
            {selectedProducts.length === 0 ? (
              <span className="flex items-center gap-3 text-foreground/70">
                <Package className="size-5 shrink-0" aria-hidden />
                <span>Бэлэглэл сонгоогүй</span>
              </span>
            ) : (
              <>
                <div className="flex -space-x-2 shrink-0">
                  {selectedProducts.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-foreground/10"
                    >
                      <PackagingImage src={p.image} alt="" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0">
                  <span className="font-medium text-foreground">
                    {selectedProducts.length} зүйл сонгосон
                  </span>
                  {totalModifier > 0 && (
                    <span className="ml-2 text-sm text-foreground/70">
                      +{totalModifier.toLocaleString()}₮
                    </span>
                  )}
                </div>
              </>
            )}
          </span>
          <span className="text-foreground/50 shrink-0" aria-hidden>Сонгох</span>
        </button>
      </fieldset>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="packaging-modal-heading"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
          <div
            className="relative w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col rounded-2xl border border-foreground/10 bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between gap-4 px-5 py-5 border-b border-foreground/10 bg-foreground/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden>
                  <Package className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 id="packaging-modal-heading" className="text-lg font-semibold text-foreground truncate">
                    Бэлэглэл сонгох
                  </h2>
                  <p className="text-sm text-foreground/60 mt-0.5">
                    Хүссэн хэдэн бүтээгдэхүүнээ сонгоно уу
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-xl p-2.5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Хаах"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Category filter pills */}
            <div className="shrink-0 flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-foreground/10 bg-foreground/[0.02] scrollbar-none">
              {(Object.keys(CATEGORY_LABELS) as PackagingCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    category === cat
                      ? "bg-primary text-white"
                      : "bg-foreground/10 text-foreground/80 hover:bg-foreground/15"
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Product grid — scrollable with bottom fade */}
            <div className="relative min-h-0 flex-1 overflow-hidden flex flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {filteredProducts.map((product) => {
                    const id = product.id as PackagingId;
                    const isSelected = selectedSet.has(id);
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => toggle(id)}
                        className={cn(
                          "group flex flex-col rounded-xl text-left overflow-hidden transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isSelected
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/10"
                            : "hover:shadow-md hover:ring-2 hover:ring-foreground/10"
                        )}
                        style={isSelected ? { backgroundColor: "rgba(91,91,214,0.08)" } : undefined}
                      >
                        <div
                          className="relative w-full flex-shrink-0 overflow-hidden rounded-t-xl bg-foreground/5"
                          style={{ height: IMAGE_HEIGHT }}
                        >
                          <PackagingImage src={product.image} alt={product.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" aria-hidden />
                          {isSelected && (
                            <span
                              className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                              aria-hidden
                            >
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            "p-3 rounded-b-xl border-t transition-colors duration-200",
                            isSelected ? "border-primary/30" : "border-foreground/10 bg-foreground/[0.02] group-hover:bg-foreground/[0.04]"
                          )}
                          style={isSelected ? { backgroundColor: "rgba(91,91,214,0.08)" } : undefined}
                        >
                          <span
                            className={cn(
                              "block text-sm leading-tight font-medium",
                              isSelected ? "text-primary" : "text-foreground"
                            )}
                          >
                            {product.title}
                          </span>
                          {product.price > 0 ? (
                            <span className="mt-1 block text-xs tabular-nums text-foreground/60">
                              +{product.price.toLocaleString()}₮
                            </span>
                          ) : (
                            <span className="mt-1.5 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                              Included
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-background to-transparent"
                aria-hidden
              />
            </div>

            {/* Footer — selected items + total + CTA */}
            <div className="shrink-0 flex flex-col gap-3 border-t border-foreground/10 bg-foreground/[0.02] px-5 py-4">
              {selectedSet.size > 0 && (
                <div className="flex items-center gap-2 min-h-0 overflow-x-auto pb-1">
                  <span className="shrink-0 text-xs font-medium text-foreground/60 uppercase tracking-wider">Сонгосон</span>
                  <div className="flex gap-2">
                    {selectedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex shrink-0 items-center gap-2 rounded-lg border border-foreground/10 bg-background px-2 py-1.5"
                      >
                        <div className="relative h-8 w-8 overflow-hidden rounded-md bg-foreground/10">
                          <PackagingImage src={p.image} alt="" />
                        </div>
                        <span className="max-w-[100px] truncate text-xs font-medium text-foreground">{p.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2 min-w-0">
                  {selectedSet.size > 0 ? (
                    <>
                      <span className="text-sm text-foreground/70">Нийт бэлэглэл</span>
                      <span className="text-lg font-semibold tabular-nums text-foreground">
                        +{getAddonsModifier(value).toLocaleString()}₮
                      </span>
                      <span className="text-xs text-foreground/50">({selectedSet.size} зүйл)</span>
                    </>
                  ) : (
                    <span className="text-sm text-foreground/50">Сонголтоо хийнэ үү</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Болсон
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export const PackagingSelection = memo(PackagingSelectionComponent);
