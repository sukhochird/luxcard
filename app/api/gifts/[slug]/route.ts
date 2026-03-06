import { NextRequest, NextResponse } from "next/server";
import giftsData from "@/data/gifts.json";
import merchantsData from "@/data/merchants.json";
import type { Gift, Merchant } from "@/lib/types";

const gifts = giftsData as Gift[];
const merchants = merchantsData as Record<string, Merchant>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const gift = gifts.find((g) => g.slug === slug);
  if (!gift) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const merchant = merchants[slug] ?? null;
  return NextResponse.json({ ...gift, merchant });
}
