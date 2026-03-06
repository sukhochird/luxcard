"use client";

import { createPortal } from "react-dom";
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/store/cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { Button } from "@/components/ui/button";
import { getPackagingModifier } from "@/app/(shop)/gifts/[slug]/PackagingSelection";
import type { PackagingId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const content = (
    <>
      <div
        role="presentation"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 ease-out",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        aria-modal="true"
        aria-label="Сагс"
        role="dialog"
        className={cn(
          "fixed right-0 top-0 bottom-0 z-[101] flex w-full max-w-md flex-col border-l border-foreground/10 bg-background shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-foreground/10 px-4 py-4">
          <h2 className="text-lg font-semibold text-foreground">Сагс</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Хаах"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8">
              <p className="text-foreground/80">Сагс хоосон байна.</p>
              <Button
                className="rounded-xl"
                style={{ backgroundColor: "#0052FF" }}
                asChild
              >
                <Link href="/gifts" onClick={onClose}>
                  Бэлгийн карт сонгох
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <p className="mb-3 text-sm text-foreground/70">
                  {totalItems} бараа
                </p>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={`${item.slug}-${item.amount}-${item.packaging}`}
                    >
                      <CartItemRow
                        item={item}
                        compact
                        onUpdateQty={(q) =>
                          updateQuantity(
                            item.slug,
                            item.amount,
                            item.packaging,
                            q
                          )
                        }
                        onRemove={() =>
                          removeItem(item.slug, item.amount, item.packaging)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 border-t border-foreground/10 bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Нийт</span>
                  <span className="text-xl font-bold text-foreground">
                    {subtotal.toLocaleString()}₮
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 rounded-xl border border-foreground/20"
                    asChild
                  >
                    <Link href="/cart" onClick={onClose}>
                      Бүтэн сагс
                    </Link>
                  </Button>
                  <Button
                    className="flex-1 rounded-xl"
                    style={{ backgroundColor: "#0052FF" }}
                    asChild
                  >
                    <Link href="/checkout" onClick={onClose}>
                      Төлбөр төлөх
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
