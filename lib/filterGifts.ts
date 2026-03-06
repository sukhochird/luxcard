import type { Gift } from "@/lib/types";

export type FilterLocation = "All" | "Ulaanbaatar" | "Darkhan" | "Erdenet";

export interface GiftFilterState {
  categories: Gift["category"][];
  occasions: Gift["occasion"][number][];
  priceRange: [number, number];
  location: FilterLocation;
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 500000;
export const PRICE_STEP = 25000;

export const defaultGiftFilterState: GiftFilterState = {
  categories: [],
  occasions: [],
  priceRange: [PRICE_MIN, PRICE_MAX],
  location: "All",
};

export function filterGifts(gifts: Gift[], state: GiftFilterState): Gift[] {
  return gifts.filter((g) => {
    if (
      state.categories.length > 0 &&
      !state.categories.includes(g.category)
    ) {
      return false;
    }
    if (
      state.occasions.length > 0 &&
      !g.occasion.some((o) => state.occasions.includes(o))
    ) {
      return false;
    }
    const minPrice = Math.min(...g.priceOptions);
    const maxPrice = Math.max(...g.priceOptions);
    if (minPrice > state.priceRange[1] || maxPrice < state.priceRange[0]) {
      return false;
    }
    if (state.location !== "All" && g.location !== state.location) {
      return false;
    }
    return true;
  });
}
