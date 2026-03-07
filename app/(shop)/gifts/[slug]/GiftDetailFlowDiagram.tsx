"use client";

import { useRef, useEffect, useState } from "react";
import { ShoppingBag, CreditCard, Send, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: 1,
    icon: ShoppingBag,
    title: "Сонгох",
    description: "Дуртай картаа сонгоод дүнгээ оруулна.",
  },
  {
    step: 2,
    icon: CreditCard,
    title: "Төлөх",
    description: "Аюулгүй төлбөрөөр төлнө.",
  },
  {
    step: 3,
    icon: Send,
    title: "Илгээх",
    description: "Одоо эсвэл товлосон цагт имэйлээр илгээнэ.",
  },
  {
    step: 4,
    icon: Gift,
    title: "Ашиглах",
    description: "Хүлээн авагч кодыг ашиглан үйлчилгээ авна.",
  },
];

export function GiftDetailFlowDiagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-14 border-t border-foreground/10 pt-10"
      aria-labelledby="flow-heading"
    >
      <h2
        id="flow-heading"
        className="text-xl font-bold text-foreground sm:text-2xl"
      >
        Хэрхэн ажилладаг вэ
      </h2>
      <p className="mt-1 text-sm text-foreground/70">
        Бэлгийн карт худалдаж авах болон ашиглах алхамууд.
      </p>

      {/* Desktop: grid with SVG connector line */}
      <div className="relative mt-8 hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {STEPS.map(({ step, icon: Icon, title, description }, index) => (
            <div
              key={step}
              className="relative flex flex-col items-center"
              style={
                inView
                  ? {
                      animation: "flow-fade-in-up 0.55s ease-out both",
                      animationDelay: `${index * 120}ms`,
                    }
                  : undefined
              }
            >
              <div
                className={cn(
                  "group flex w-full flex-col items-center rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 text-center transition-all duration-300",
                  "hover:border-primary/30 hover:bg-primary/[0.04] hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                )}
              >
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon
                    className={cn(
                      "size-7 transition-transform duration-300 group-hover:animate-flow-icon-float"
                    )}
                    aria-hidden
                  />
                </div>
                <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  Алхам {step}
                </span>
                <h3 className="mt-1 font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-snug text-foreground/70">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Animated dashed connector line (desktop) */}
        <svg
          className="absolute left-0 top-[4.5rem] h-0 w-full pointer-events-none"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="flow-line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <line
            x1="12%"
            y1="0"
            x2="88%"
            y2="0"
            stroke="url(#flow-line-gradient)"
            strokeWidth="2"
            strokeDasharray="12 8"
            strokeLinecap="round"
            style={{
              strokeDashoffset: inView ? undefined : 400,
              ...(inView && {
                animation: "flow-arrow-dash 1.2s ease-out both",
                animationDelay: "0.45s",
              }),
            }}
          />
        </svg>
      </div>

      {/* Mobile/tablet: stacked cards with staggered animation */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {STEPS.map(({ step, icon: Icon, title, description }, index) => (
          <div
            key={step}
            className="flex flex-col items-center"
            style={
              inView
                ? {
                    animation: "flow-fade-in-up 0.55s ease-out both",
                    animationDelay: `${index * 100}ms`,
                  }
                : undefined
            }
          >
            <div
              className={cn(
                "group flex w-full flex-col items-center rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 text-center transition-all duration-300",
                "active:scale-[0.98] hover:border-primary/20 hover:bg-primary/[0.03]"
              )}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:animate-flow-icon-float">
                <Icon className="size-6" aria-hidden />
              </div>
              <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Алхам {step}
              </span>
              <h3 className="mt-1 font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Step indicators with pulse animation when in view */}
      <div
        className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        aria-hidden
      >
        {STEPS.map((s, i) => (
          <div key={s.step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary transition-transform duration-300",
                inView && "animate-flow-pulse-ring"
              )}
              style={inView ? { animationDelay: `${0.6 + i * 0.15}s` } : undefined}
            >
              {s.step}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "text-lg text-foreground/40 transition-opacity duration-300",
                  inView && "animate-pulse"
                )}
                style={
                  inView ? { animationDelay: `${0.5 + i * 0.1}s` } : undefined
                }
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
