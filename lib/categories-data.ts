import path from "path";
import fs from "fs";
import type { GiftCategory } from "@/lib/types";

export function getCategoriesPath(): string {
  return path.join(process.cwd(), "data", "categories.json");
}

export function loadCategories(): GiftCategory[] {
  const p = getCategoriesPath();
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as GiftCategory[];
}
