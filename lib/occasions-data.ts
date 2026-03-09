import path from "path";
import fs from "fs";
import type { OccasionOption } from "@/lib/types";

export function getOccasionsPath(): string {
  return path.join(process.cwd(), "data", "occasions.json");
}

export function loadOccasions(): OccasionOption[] {
  const p = getOccasionsPath();
  const raw = fs.readFileSync(p, "utf-8");
  const list = JSON.parse(raw) as OccasionOption[];
  return list.slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
