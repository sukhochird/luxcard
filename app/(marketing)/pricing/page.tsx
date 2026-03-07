import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Үнийн төлөвлөгөө",
  description:
    "LuxCard дээр бэлгийн карт борлуулах худалдаа эрхлэгчдэд зориулсан үнийн төлөвлөгөө. Сарын 30,000₮-аас эхэлдэг багцууд.",
};

const PLANS = [
  {
    id: "starter",
    name: "Эхлэгч",
    description: "Жижиг бизнес, нэг салбарт зориулсан",
    priceMonthly: "30,000",
    priceYearly: "300,000",
    periodLabel: "₮/сар",
    periodYearLabel: "₮/жил",
    features: [
      "1 салбар, 1 бэлгийн карт",
      "Имэйлээр ирүүлэлт",
      "Үндсэн тайлан",
      "LuxCard дээр жагсаалтад орно",
    ],
    cta: "Эхлүүлэх",
    href: "#",
    highlighted: false,
    icon: Zap,
  },
  {
    id: "growth",
    name: "Өсөлт",
    description: "Олон салбар, олон картын сонголт",
    priceMonthly: "99,000",
    priceYearly: "990,000",
    periodLabel: "₮/сар",
    periodYearLabel: "₮/жил",
    features: [
      "5 хүртэл салбар",
      "Хязгааргүй бэлгийн карт",
      "Дэлгэрэнгүй аналитик",
      "Товлосон цагт илгээлт",
      "Туслах дэмжлэг",
    ],
    cta: "Сонгох",
    href: "#",
    highlighted: true,
    icon: Sparkles,
  },
  {
    id: "enterprise",
    name: "Дээд",
    description: "Том байгууллага, брендүүдэд",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    periodLabel: "",
    periodYearLabel: "",
    features: [
      "Хязгааргүй салбар",
      "API холболт",
      "Тусгай гэрээ, хувийн дэмжлэг",
      "Брендийн өнгө, лого",
      "Дэлгэрэнгүй тайлан, интеграци",
    ],
    cta: "Холбогдох",
    href: "#",
    highlighted: false,
    icon: Building2,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="border-b border-foreground/10 bg-foreground/[0.02] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Үнийн төлөвлөгөө
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              LuxCard дээр бэлгийн картаа борлуулахын тулд бизнесээ тохируул. Сарын 30,000₮-аас эхэлдэг багцууд — сар бүр эсвэл жилийн төлбөрөөр хэмнэ.
            </p>
          </div>
        </section>

        {/* Toggle: monthly / yearly - placeholder for future */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8",
                      plan.highlighted
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-foreground/10"
                    )}
                  >
                    {plan.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                        Санал болгох
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {plan.name}
                        </h2>
                        <p className="text-sm text-foreground/60">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground sm:text-3xl">
                        {plan.priceMonthly}
                      </span>
                      {plan.periodLabel && (
                        <span className="text-foreground/60">
                          {plan.periodLabel}
                        </span>
                      )}
                    </div>
                    {plan.priceYearly && plan.priceYearly !== "Custom" && (
                      <p className="mt-1 text-sm text-foreground/60">
                        Жилд {plan.priceYearly}₮ (2 сар үнэгүй)
                      </p>
                    )}
                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <Check
                            className="size-5 shrink-0 text-primary"
                            aria-hidden
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      size="lg"
                      variant={plan.highlighted ? "primary" : "outline"}
                      className="mt-8 w-full rounded-2xl"
                    >
                      <Link href={plan.href}>
                        {plan.cta}
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-foreground/10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Тодорхойгүй байна уу?
            </h2>
            <p className="mt-2 text-foreground/70">
              Бидний баг танд тохирох төлөвлөгөөг сонгоход туслана.
            </p>
            <Button asChild className="mt-6 rounded-2xl bg-primary px-8" size="lg">
              <Link href="#">Холбоо барих</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
