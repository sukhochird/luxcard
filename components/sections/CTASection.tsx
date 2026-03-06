import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-2xl px-6 py-16 text-center sm:px-12 lg:px-24 lg:py-20"
          style={{ backgroundColor: "#0A0B0D" }}
        >
          <h2
            id="cta-heading"
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Утга учиртай бэлгийг шууд илгээнэ
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Орон нутгийн бизнес сонгоод мессеж нэмж, төгс бэлгийг секундэд
            хүргэнэ.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-2xl px-8 text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0D]"
              style={{ backgroundColor: "#0052FF" }}
              asChild
            >
              <Link href="/gifts">Бэлгийн карт илгээх</Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-2xl border border-white/20 bg-white/10 text-white transition-all duration-200 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0D] dark:border-foreground/20 dark:bg-foreground/10 dark:hover:bg-foreground/20 dark:ring-offset-background"
              asChild
            >
              <Link href="/gifts">Бэлгийн картуудыг үзэх</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
