import { NextRequest, NextResponse } from "next/server";
import { loadGifts } from "@/lib/gifts-data";
import { parseCommaParam } from "@/lib/gifts-filter-url";
import type { Gift } from "@/lib/types";

const PRICE_MIN = 30_000;
const PRICE_MAX = 3_000_000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = parseCommaParam(searchParams, "category");
  const occasion = parseCommaParam(searchParams, "occasion");
  const location = searchParams.get("location");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const featured = searchParams.get("featured") === "true";

  const gifts = loadGifts();
  let result = [...gifts];

  if (featured) {
    result = result.filter((g) => g.featured);
  }
  if (category.length > 0) {
    result = result.filter((g) => category.includes(g.category));
  }
  if (occasion.length > 0) {
    result = result.filter((g) =>
      g.occasion.some((o) => occasion.includes(o))
    );
  }
  if (location && location !== "All") {
    result = result.filter((g) => g.location === location);
  }
  const min = priceMin ? parseInt(priceMin, 10) : PRICE_MIN;
  const max = priceMax ? parseInt(priceMax, 10) : PRICE_MAX;
  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    result = result.filter((g) => {
      const gMin = Math.min(...g.priceOptions);
      const gMax = Math.max(...g.priceOptions);
      const rangeMin = Number.isNaN(min) ? PRICE_MIN : min;
      const rangeMax = Number.isNaN(max) ? PRICE_MAX : max;
      return gMin <= rangeMax && gMax >= rangeMin;
    });
  }

  const total = result.length;
  const limitParam = searchParams.get("limit");
  const pageParam = searchParams.get("page");
  const limit = Math.min(
    500,
    Math.max(1, parseInt(limitParam ?? "12", 10) || 12)
  );
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * limit;
  const items = result.slice(offset, offset + limit);

  return NextResponse.json({
    items,
    total,
    page: currentPage,
    limit,
    totalPages,
  });
}
