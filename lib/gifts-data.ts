import path from "path";
import fs from "fs";
import type { Gift } from "@/lib/types";

export function getGiftsPath(): string {
  return path.join(process.cwd(), "data", "gifts.json");
}

export function loadGifts(): Gift[] {
  const p = getGiftsPath();
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as Gift[];
}

export function saveGifts(gifts: Gift[]): void {
  const p = getGiftsPath();
  fs.writeFileSync(p, JSON.stringify(gifts, null, 2), "utf-8");
}
