"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getPackagingModifier } from "@/app/(shop)/gifts/[slug]/PackagingSelection";
import type { PackagingId } from "@/lib/types";
import type { CartItem } from "@/lib/types";
import { Trash2 } from "lucide-react";

export function CartItemRow({
  item,
  onUpdateQty,
  onRemove,
  compact,
}: {
  item: CartItem;
  onUpdateQty: (q: number) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  const packMod = getPackagingModifier(item.packaging as PackagingId);
  const unitPrice = Math.round(
    item.amount * (1 - (item.discountPercent ?? 0) / 100)
  );
  const lineTotal = (unitPrice + packMod) * item.quantity;
  const hasDiscount = (item.discountPercent ?? 0) > 0;

  if (compact) {
    return (
      <article className="flex gap-3 rounded-xl border border-foreground/10 bg-background p-3">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 25vw, 80px"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground line-clamp-2">
            {item.title}
          </h2>
          <p className="text-xs text-foreground/60">
            {unitPrice.toLocaleString()}₮
            {packMod > 0 && ` +${packMod.toLocaleString()}₮`} × {item.quantity}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center gap-0.5 rounded-md border border-foreground/20 bg-foreground/5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md text-xs"
                onClick={() => onUpdateQty(item.quantity - 1)}
                aria-label="Тоо багасгах"
              >
                −
              </Button>
              <span className="min-w-[1.25rem] text-center text-xs font-medium">
                {item.quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md text-xs"
                onClick={() => onUpdateQty(item.quantity + 1)}
                aria-label="Тоо нэмэгдүүлэх"
              >
                +
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-foreground/60 hover:text-red-600"
              onClick={onRemove}
              aria-label="Сагснаас устгах"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
        <div className="shrink-0 text-right text-sm font-bold text-foreground">
          {lineTotal.toLocaleString()}₮
        </div>
      </article>
    );
  }

  return (
    <article className="flex gap-4 rounded-2xl border border-foreground/10 bg-background p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 25vw, 112px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-foreground">{item.title}</h2>
        <p className="text-sm text-foreground/70">{item.merchant}</p>
        <p className="mt-1 text-sm text-foreground/60">
          {item.amount.toLocaleString()}₮
          {hasDiscount && (
            <span className="ml-2 text-primary">
              −{item.discountPercent}% → {unitPrice.toLocaleString()}₮
            </span>
          )}
          {packMod > 0 && (
            <span className="ml-1">+ {packMod.toLocaleString()}₮ бэлэглэл</span>
          )}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-foreground/20 bg-foreground/5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onUpdateQty(item.quantity - 1)}
              aria-label="Тоо багасгах"
            >
              −
            </Button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onUpdateQty(item.quantity + 1)}
              aria-label="Тоо нэмэгдүүлэх"
            >
              +
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground/60 hover:text-red-600"
            onClick={onRemove}
            aria-label="Сагснаас устгах"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-bold text-foreground">
          {lineTotal.toLocaleString()}₮
        </p>
      </div>
    </article>
  );
}
