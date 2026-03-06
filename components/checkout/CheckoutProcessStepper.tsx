"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Захиалга өгөх" },
  { id: 2, label: "Баталгаажуулах" },
  { id: 3, label: "Илгээх" },
  { id: 4, label: "Хүлээн авагч хүлээн авсан" },
] as const;

interface CheckoutProcessStepperProps {
  /** 1–4, одоогийн алхам */
  currentStep: number;
  className?: string;
}

export function CheckoutProcessStepper({
  currentStep,
  className,
}: CheckoutProcessStepperProps) {
  const step = Math.min(4, Math.max(1, currentStep));

  return (
    <nav
      className={cn("w-full", className)}
      aria-label="Захиалгын процесс"
    >
      <ol className="flex items-center justify-between gap-1">
        {STEPS.map((s, index) => {
          const isDone = s.id < step;
          const isCurrent = s.id === step;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={s.id}
              className={cn(
                "flex flex-1 items-center",
                !isLast && "flex-1"
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isDone &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-background text-primary",
                    !isDone &&
                      !isCurrent &&
                      "border-foreground/20 bg-background text-foreground/50"
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    s.id
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    isCurrent ? "text-foreground" : "text-foreground/70"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 min-w-[8px] rounded sm:mx-2",
                    isDone ? "bg-primary" : "bg-foreground/15"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
