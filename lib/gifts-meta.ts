import type { Gift, GiftCategory, GiftOccasion } from "@/lib/types";

export function getCategoriesFromGifts(gifts: Gift[]): GiftCategory[] {
  const set = new Set<GiftCategory>();
  for (const g of gifts) set.add(g.category);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getOccasionsFromGifts(gifts: Gift[]): GiftOccasion[] {
  const set = new Set<GiftOccasion>();
  for (const g of gifts) {
    for (const o of g.occasion) set.add(o);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
