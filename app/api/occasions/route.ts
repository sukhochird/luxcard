import { NextResponse } from "next/server";
import { loadOccasions } from "@/lib/occasions-data";

export async function GET() {
  const occasions = loadOccasions();
  return NextResponse.json({ occasions });
}
