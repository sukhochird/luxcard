"use client";

import { memo } from "react";
import { ShieldCheck, Clock, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: ShieldCheck, label: "Баталгаажсан худалдаа эрхлэгч" },
  { icon: Clock, label: "Шууд хүргэлт" },
  { icon: CreditCard, label: "Аюулгүй төлбөр" },
];

function TrustIndicatorsComponent() {
  return (
    <div
      className="flex flex-wrap gap-3"
      role="list"
      aria-label="Итгэлийн үзүүлэлт"
    >
      {ITEMS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-foreground/10 bg-background px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md",
            "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          )}
          role="listitem"
        >
          <Icon className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-medium text-foreground/80">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export const TrustIndicators = memo(TrustIndicatorsComponent);
