import Image from "next/image";
import {
  Zap,
  ShieldCheck,
  Wallet,
  CreditCard,
} from "lucide-react";
import { FALLBACK_BLUR } from "@/lib/blur-constants";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: Zap,
    title: "Instant Digital Delivery",
    description: "Gift cards are delivered by email within seconds. No waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Merchants",
    description: "Every business on LuxCard is vetted and trusted locally.",
  },
  {
    icon: Wallet,
    title: "Flexible Gift Amounts",
    description: "Choose from multiple denominations to match your budget.",
  },
  {
    icon: CreditCard,
    title: "Secure Checkout",
    description: "Your payment and personal data are protected end-to-end.",
  },
];

export function WhyLuxCard() {
  return (
    <section
      className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              alt="Friends celebrating with a gift"
              fill
              placeholder="blur"
              blurDataURL={FALLBACK_BLUR}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-500"
              loading="lazy"
            />
          </div>
          <div>
            <h2
              id="why-heading"
              className="text-3xl font-bold text-foreground sm:text-4xl"
            >
              Why LuxCard?
            </h2>
            <p className="mt-3 text-lg text-foreground/80">
              We make gifting local experiences simple, secure, and memorable.
            </p>
            <ul className="mt-10 space-y-6">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-4">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md"
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-foreground/70">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
