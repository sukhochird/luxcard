"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { getPackagingModifier } from "@/app/(shop)/gifts/[slug]/PackagingSelection";
import type { PackagingId } from "@/lib/types";
import { useMemo } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const { subtotal, totalItems } = useMemo(() => {
    let sub = 0;
    let n = 0;
    for (const item of items) {
      const packMod = getPackagingModifier(item.packaging as PackagingId);
      const unit = Math.round(
        item.amount * (1 - (item.discountPercent ?? 0) / 100)
      );
      sub += (unit + packMod) * item.quantity;
      n += item.quantity;
    }
    return { subtotal: sub, totalItems: n };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Сагс</h1>
        <p className="mt-4 text-foreground/80">Таны сагс хоосон байна.</p>
        <Button className="mt-6 rounded-2xl" style={{ backgroundColor: "#0052FF" }} asChild>
          <Link href="/gifts">Бэлгийн картуудыг үзэх</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Сагс</h1>
      <p className="mt-2 text-foreground/80">
        {totalItems} бараа
      </p>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={`${item.slug}-${item.amount}-${item.packaging}`}>
            <CartItemRow
              item={item}
              onUpdateQty={(q) =>
                updateQuantity(item.slug, item.amount, item.packaging, q)
              }
              onRemove={() =>
                removeItem(item.slug, item.amount, item.packaging)
              }
            />
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            Нийт
          </span>
          <span className="text-2xl font-bold text-foreground">
            {subtotal.toLocaleString()}₮
          </span>
        </div>
        <Button
          size="lg"
          className="mt-6 w-full rounded-2xl sm:w-auto"
          style={{ backgroundColor: "#0052FF" }}
          asChild
        >
          <Link href="/checkout">Төлбөрт шилжих</Link>
        </Button>
      </div>
    </div>
  );
}
