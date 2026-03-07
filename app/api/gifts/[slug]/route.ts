import { NextRequest, NextResponse } from "next/server";
import merchantsData from "@/data/merchants.json";
import { loadGifts, saveGifts } from "@/lib/gifts-data";
import type { Gift, GiftCategory, GiftLocation, GiftOccasion, Merchant } from "@/lib/types";

const merchants = merchantsData as Record<string, Merchant>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const gifts = loadGifts();
  const gift = gifts.find((g) => g.slug === slug);
  if (!gift) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const merchant = merchants[slug] ?? null;
  return NextResponse.json({ ...gift, merchant });
}

/** Partial update; only provided fields are updated. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const gifts = loadGifts();
  const index = gifts.findIndex((g) => g.slug === slug);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const current = gifts[index];
  const allowed = [
    "title",
    "merchant",
    "category",
    "occasion",
    "location",
    "priceOptions",
    "featured",
    "image",
    "images",
    "description",
    "discountPercent",
    "howToUse",
    "termsOfUse",
  ] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) {
      (current as Record<string, unknown>)[key] = body[key];
    }
  }
  if (Array.isArray(current.occasion)) {
    current.occasion = current.occasion.filter(
      (o): o is GiftOccasion => typeof o === "string"
    );
  }
  if (Array.isArray(current.priceOptions)) {
    current.priceOptions = current.priceOptions
      .map((n) => (typeof n === "number" ? n : parseInt(String(n), 10)))
      .filter((n) => !Number.isNaN(n));
  }
  if (typeof current.category !== "string") {
    current.category = current.category as GiftCategory;
  }
  if (typeof current.location !== "string") {
    current.location = current.location as GiftLocation;
  }
  try {
    saveGifts(gifts);
  } catch (err) {
    console.error("Failed to save gifts.json", err);
    return NextResponse.json(
      { error: "Failed to save (e.g. read-only filesystem)" },
      { status: 500 }
    );
  }
  return NextResponse.json(current);
}
