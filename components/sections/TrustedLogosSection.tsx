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

function MarqueeRow({
  logos,
  direction = "left",
  duration = 30,
}: {
  logos: typeof LOGOS;
  direction?: "left" | "right";
  duration?: number;
}) {
  const duplicated = [...logos, ...logos];
  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex shrink-0 gap-6"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {duplicated.map((logo, i) => (
          <LogoPlaceholder
            key={`${logo.id}-${i}`}
            name={logo.name}
            id={logo.id}
          />
        ))}
      </div>
    </div>
  );
}

export function TrustedLogosSection() {
  return (
    <section
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="trusted-heading"
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div className="mx-auto max-w-7xl">
        <h2
          id="trusted-heading"
          className="text-center text-sm font-medium uppercase tracking-wider text-foreground/60"
        >
          500+ орон нутгийн бизнес итгэж байна
        </h2>
        <div className="mt-8 flex flex-col gap-6">
          <MarqueeRow logos={LOGOS} direction="left" duration={35} />
          <MarqueeRow logos={LOGOS} direction="right" duration={40} />
        </div>
      </div>
    </section>
  );
}
