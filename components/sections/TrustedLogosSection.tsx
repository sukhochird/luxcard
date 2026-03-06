"use client";

import { cn } from "@/lib/utils";

const LOGOS = [
  { name: "Merchant 1", id: "1" },
  { name: "Merchant 2", id: "2" },
  { name: "Merchant 3", id: "3" },
  { name: "Merchant 4", id: "4" },
  { name: "Merchant 5", id: "5" },
  { name: "Merchant 6", id: "6" },
];

function LogoPlaceholder({ name, id }: { name: string; id: string }) {
  return (
    <div
      className={cn(
        "flex h-14 w-28 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:bg-primary/5 sm:h-16 sm:w-32"
      )}
      aria-hidden
    >
      <span className="text-xs font-semibold text-foreground/40 sm:text-sm">
        {name}
      </span>
    </div>
  );
}

export function TrustedLogosSection() {
  return (
    <section
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="trusted-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="trusted-heading"
          className="text-center text-sm font-medium uppercase tracking-wider text-foreground/60"
        >
          500+ орон нутгийн бизнес итгэж байна
        </h2>
        <div className="mt-8 flex justify-center overflow-x-auto pb-2 scrollbar-thin sm:overflow-visible sm:pb-0">
          <div className="flex flex-nowrap gap-6 sm:flex-wrap sm:justify-center">
            {LOGOS.map((logo) => (
              <LogoPlaceholder key={logo.id} name={logo.name} id={logo.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
