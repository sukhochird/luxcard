"use client";

import { memo } from "react";
import { Mail, Package, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export type PackagingId = "standard" | "premium" | "giftbag";

export interface PackagingOption {
  id: PackagingId;
  title: string;
  priceModifier: number;
  icon: typeof Mail;
}

export const PACKAGING_OPTIONS: PackagingOption[] = [
  { id: "standard", title: "Стандарт дугтуй", priceModifier: 0, icon: Mail },
  { id: "premium", title: "Дээд зэргийн хайрцаг", priceModifier: 10000, icon: Package },
  { id: "giftbag", title: "Бэлгийн уут", priceModifier: 5000, icon: Gift },
];

export function getPackagingModifier(id: PackagingId): number {
  return PACKAGING_OPTIONS.find((o) => o.id === id)?.priceModifier ?? 0;
}

interface PackagingSelectionProps {
  value: PackagingId;
  onChange: (id: PackagingId) => void;
}

function PackagingSelectionComponent({ value, onChange }: PackagingSelectionProps) {
  return (
    <fieldset className="space-y-3 border-0 p-0 m-0 min-w-0">
      <legend className="mb-0 block px-0 text-sm font-semibold text-foreground">
        Бэлэглэл <span className="font-normal text-foreground/60">(заавал биш)</span>
      </legend>
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Бэлэглэл сонгох"
      >
        {PACKAGING_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <label
              key={opt.id}
            className={cn(
              "flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all duration-150",
              value === opt.id
                ? "border-primary bg-primary/5 shadow-md focus-within:ring-0"
                : "border-foreground/20 bg-background hover:border-foreground/40 hover:shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            )}
            >
              <input
                type="radio"
                name="packaging"
                value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
                className="sr-only"
                aria-label={opt.title}
              />
              <div className="flex size-12 items-center justify-center rounded-xl bg-foreground/10 text-foreground/70">
                <Icon className="size-6" aria-hidden />
              </div>
              <span className="mt-2 font-medium text-foreground">{opt.title}</span>
              {opt.priceModifier > 0 ? (
                <span className="mt-0.5 text-sm text-foreground/70">
                  +{opt.priceModifier.toLocaleString()}₮
                </span>
              ) : (
                <span className="mt-0.5 text-sm text-foreground/50">Багтсан</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export const PackagingSelection = memo(PackagingSelectionComponent);
