"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface PriceSelectorProps {
  options: number[];
  value: number;
  onChange: (amount: number) => void;
}

function PriceSelectorComponent({
  options,
  value,
  onChange,
}: PriceSelectorProps) {
  return (
    <fieldset className="space-y-3 border-0 p-0 m-0 min-w-0">
      <legend className="mb-0 block px-0 text-sm font-semibold text-foreground">
        Gift amount
      </legend>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Select gift amount"
      >
        {options.map((amount) => (
          <label
            key={amount}
            className={cn(
              "cursor-pointer rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-150",
              value === amount
                ? "border-primary bg-primary/10 text-foreground focus-within:ring-0"
                : "border-foreground/20 bg-background text-foreground hover:border-foreground/40 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            )}
          >
            <input
              type="radio"
              name="amount"
              value={amount}
              checked={value === amount}
              onChange={() => onChange(amount)}
              className="sr-only"
              aria-label={`${amount.toLocaleString()} tugriks`}
            />
            {amount.toLocaleString()}₮
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export const PriceSelector = memo(PriceSelectorComponent);
