import Link from "next/link";
import { Store, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Нэмэлт орлого",
    description: "Бэлгийн картаар үйлчлүүлэгчдийг татаж, борлуулалтаа нэмэгдүүл.",
  },
  {
    icon: Users,
    title: "Шинэ харилцагчид",
    description: "LuxCard платформын хэрэглэгчдэд таны бизнесээ танилцуул.",
  },
  {
    icon: Zap,
    title: "Хялбар эхлүүлэх",
    description: "Бүртгэл нээгээд картуудыг нэмж, шууд борлуулалт эхлүүл.",
  },
];

export function MerchantSection() {
  return (
    <section
      id="for-merchants"
      className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="merchant-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Store className="size-7" aria-hidden />
              </div>
              <h2
                id="merchant-heading"
                className="mt-6 text-3xl font-bold text-foreground sm:text-4xl"
              >
                Худалдаа эрхлэгчдэд
              </h2>
              <p className="mt-4 text-lg text-foreground/80">
                Таны бизнесийн бэлгийн картыг LuxCard дээр борлуулж, шинэ
                үйлчлүүлэгчдэд хүрэх боломжтой. Тохиргоо хийгээд өдөрт нь
                борлуулалтаа эхлүүл.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="rounded-2xl px-6 font-semibold"
                  style={{ backgroundColor: "#0052FF" }}
                  asChild
                >
                  <Link href="/about#merchants">
                    Бэлгийн карт борлуулах эхлэх
                  </Link>
                </Button>
              </div>
            </div>
            <ul className="flex flex-col gap-6 sm:grid sm:grid-cols-1 lg:w-[380px]">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      {description}
                    </p>
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
