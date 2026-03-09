import { NextResponse } from "next/server";
import { loadCategories } from "@/lib/categories-data";

export async function GET() {
  const categories = loadCategories();
  return NextResponse.json({ categories });
}
