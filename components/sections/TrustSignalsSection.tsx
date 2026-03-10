"use client";

import { Star, Gift, Shield } from "lucide-react";

const SIGNALS = [
  {
    icon: Star,
    value: "500+",
    label: "сэтгэгдэл",
  },
  {
    icon: Gift,
    value: "10,000+",
    label: "бэлэг илгээсэн",
  },
  {
    icon: Shield,
    value: "50+",
    label: "баталгаат дэлгүүр",
  },
];

export function TrustSignalsSection() {
  return (
    <section
      className="border-y border-foreground/10 bg-foreground/[0.02] px-4 py-6 sm:px-6 lg:px-8"
      aria-label="Итгэл үнэмшил"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
        {SIGNALS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 text-foreground/80"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <span className="block text-lg font-bold tabular-nums text-foreground sm:text-xl">
                {value}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
