"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

const CART_KEY = "luxcard-cart";

function itemKey(slug: string, amount: number, packaging: CartItem["packaging"]) {
  return `${slug}-${amount}-${packaging}`;
}

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, amount: number, packaging: CartItem["packaging"]) => void;
  updateQuantity: (
    slug: string,
    amount: number,
    packaging: CartItem["packaging"],
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
        const key = itemKey(item.slug, item.amount, item.packaging);
        set((state) => {
          const idx = state.items.findIndex(
            (i) => itemKey(i.slug, i.amount, i.packaging) === key
          );
          const next =
            idx >= 0
              ? state.items.map((i, iidx) =>
                  iidx === idx
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                )
              : [...state.items, { ...item }];
          return { items: next };
        });
      },

      removeItem: (slug, amount, packaging) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.slug === slug && i.amount === amount && i.packaging === packaging)
          ),
        }));
      },

      updateQuantity: (slug, amount, packaging, quantity) => {
        const q = Math.max(0, Math.min(10, quantity));
        if (q === 0) {
          get().removeItem(slug, amount, packaging);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug && i.amount === amount && i.packaging === packaging
              ? { ...i, quantity: q }
              : i
          ),
        }));
      },

      getTotalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      clearCart: () => set({ items: [] }),
    }),
    { name: CART_KEY }
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
