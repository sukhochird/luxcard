"use client";

import { memo, useState, useMemo } from "react";
import Image from "next/image";
import { X, Package } from "lucide-react";
import type { PackagingId } from "@/lib/types";
import { cn } from "@/lib/utils";
import packagingData from "@/data/packaging.json";

export type { PackagingId };

export interface PackagingProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

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

function PackagingSelectionComponent({ value, onChange }: PackagingSelectionProps) {
  const [open, setOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(value), [value]);
  const totalModifier = useMemo(() => getAddonsModifier(value), [value]);
  const selectedProducts = useMemo(
    () => PACKAGING_PRODUCTS.filter((p) => selectedSet.has(p.id as PackagingId)),
    [selectedSet]
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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="packaging-modal-heading"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border border-foreground/10 bg-background shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between border-b border-foreground/10 px-4 py-4">
              <h2 id="packaging-modal-heading" className="text-lg font-semibold text-foreground">
                Бэлэглэл сонгох
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-foreground/70 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Хаах"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="shrink-0 px-4 pt-2 pb-3 text-sm text-foreground/70">
              Хүссэн хэдэн бүтээгдэхүүнээ сонгоно уу. Бодит зурагтай.
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {PACKAGING_PRODUCTS.map((product) => {
                  const id = product.id as PackagingId;
                  const isSelected = selectedSet.has(id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggle(id)}
                      className={cn(
                        "flex flex-col rounded-xl border-2 text-left transition-all duration-150 overflow-hidden",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/30"
                          : "border-foreground/20 bg-foreground/[0.02] hover:border-foreground/40 hover:bg-foreground/[0.04]"
                      )}
                    >
                      <div className="relative aspect-square w-full bg-foreground/5">
                        <PackagingImage src={product.image} alt={product.title} />
                        {isSelected && (
                          <span
                            className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold"
                            aria-hidden
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <span className={cn("block font-medium", isSelected ? "text-primary" : "text-foreground")}>
                          {product.title}
                        </span>
                        {product.price > 0 ? (
                          <span className="mt-0.5 block text-sm text-foreground/70">
                            +{product.price.toLocaleString()}₮
                          </span>
                        ) : (
                          <span className="mt-0.5 block text-sm text-foreground/50">Багтсан</span>
                        )}
                        {product.description && (
                          <span className="mt-0.5 block text-xs text-foreground/55">{product.description}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 p-4">
              <p className="text-sm text-foreground/70">
                {selectedSet.size > 0 && (
                  <>Нийт бэлэглэл: +{getAddonsModifier(value).toLocaleString()}₮</>
                )}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border-2 border-foreground/20 bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const PackagingSelection = memo(PackagingSelectionComponent);
