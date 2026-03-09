"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, PackagingId } from "@/lib/types";

const CART_KEY = "luxcard-cart";

function addonsKey(addons: PackagingId[]): string {
  return [...addons].sort().join(",");
}

function itemKey(slug: string, amount: number, addons: PackagingId[]) {
  return `${slug}-${amount}-${addonsKey(addons)}`;
}

/** Migrate old persisted items that had packaging (single) to addons (array) */
function migrateItem(i: Record<string, unknown>): CartItem {
  const item = i as unknown as CartItem;
  if (Array.isArray(item.addons)) return item;
  const packaging = (i as { packaging?: PackagingId }).packaging;
  const addons: PackagingId[] =
    packaging === undefined || packaging === "standard" ? [] : [packaging];
  return { ...item, addons };
}

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, amount: number, addons: PackagingId[]) => void;
  updateQuantity: (
    slug: string,
    amount: number,
    addons: PackagingId[],
    quantity: number
  ) => void;
  getTotalItems: () => number;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const key = itemKey(item.slug, item.amount, item.addons);
        set((state) => {
          const migrated = state.items.map((i) =>
            "addons" in i ? i : migrateItem(i as unknown as Record<string, unknown>)
          );
          const idx = migrated.findIndex(
            (i) => itemKey(i.slug, i.amount, i.addons) === key
          );
          const next =
            idx >= 0
              ? migrated.map((i, iidx) =>
                  iidx === idx
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                )
              : [...migrated, { ...item }];
          return { items: next };
        });
      },

      removeItem: (slug, amount, addons) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.slug === slug &&
                i.amount === amount &&
                addonsKey(i.addons) === addonsKey(addons)
              )
          ),
        }));
      },

      updateQuantity: (slug, amount, addons, quantity) => {
        const q = Math.max(0, Math.min(10, quantity));
        if (q === 0) {
          get().removeItem(slug, amount, addons);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug &&
            i.amount === amount &&
            addonsKey(i.addons) === addonsKey(addons)
              ? { ...i, quantity: q }
              : i
          ),
        }));
      },

      getTotalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: CART_KEY,
      partialize: (state) => ({ items: state.items }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            if (parsed?.state?.items) {
              parsed.state.items = parsed.state.items.map((i: Record<string, unknown>) =>
                migrateItem(i)
              );
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) =>
          localStorage.setItem(name, typeof value === "string" ? value : JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const clearCart = useCartStore((s) => s.clearCart);
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    clearCart,
  };
}
