import Link from "next/link";
import { Gift, CreditCard, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Gift,
    title: "Бэлэг сонгох",
    description:
      "Баяр ёслол, ангилал эсвэл байршлаар сонгоно. Монгол дахь орон нутгийн бизнесээс сонго.",
  },
  {
    icon: CreditCard,
    title: "Хувилбар болгох & Төлөх",
    description:
      "Хувийн мессеж нэмж, аюулгүй төлнө. Нэг удаагийн худалдаанд бүртгэл шаардлагагүй.",
  },
  {
    icon: Send,
    title: "Шууд илгээх",
    description:
      "Хүлээн авагч имэйл эсвэл холбоосоор бэлгийн картаа авна. Шууд ашиглаж болно.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="how-heading"
          className="text-3xl font-bold text-foreground sm:text-4xl"
        >
          Хэрхэн ажилладаг вэ
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Гурван энгийн алхамаар орон нутгийн бэлгийн карт илгээнэ.
        </p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className={cn(
                "flex flex-col rounded-2xl border border-foreground/10 bg-background p-8 shadow-lg transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl"
              )}
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                <step.icon className="size-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-foreground/70">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/gifts"
            className="text-sm font-medium text-primary hover:underline"
          >
            Бэлгийн картуудыг үзэх →
          </Link>
        </div>
      </div>
    </section>
  );
}
