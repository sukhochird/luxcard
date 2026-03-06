"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.02] py-12 text-center"
      role="status"
      aria-label="Илэрц олдсонгүй"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-foreground/10 text-foreground/40">
        <Gift className="size-7" aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Бэлгийн карт олдсонгүй.
      </h2>
      <Button variant="secondary" size="sm" className="mt-4 rounded-xl" asChild>
        <Link href="/gifts">Шүүлтийг цэвэрлэх</Link>
      </Button>
    </div>
  );
}
