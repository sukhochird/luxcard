"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, Store, Gift, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const FLOATING_BADGES = [
  { icon: Clock, label: "Шууд хүргэлт" },
  { icon: ShieldCheck, label: "Аюулгүй төлбөр" },
  { icon: Store, label: "Найдвартай худалдаа эрхлэгчид" },
];

const SLIDES = [
  {
    badge: "Монгол дахь орон нутгийн бэлгийн карт",
    title: "Орон нутгийн бэлгийн картыг",
    titleHighlight: "шууд",
    titleEnd: "илгээнэ",
    description:
      "Монгол дахь ресторан, салон, кофе шоп болон мартагдашгүй туршлага. Секундэд утга учиртай бэлэг өгнө.",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=85",
  },
  {
    badge: "Ресторан, кофе шоп",
    title: "Дуртай газраа",
    titleHighlight: "бэлэглэнэ",
    titleEnd: "",
    description:
      "Улаанбаатар, Дархан, Эрдэнэтийн шилдэг ресторан, кофе шопын бэлгийн карт. Имэйл эсвэл SMS-ээр шууд илгээнэ.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85",
  },
  {
    badge: "Спа, гоо сайхан, аялал",
    title: "Туршлага болгон",
    titleHighlight: "бэлэг",
    titleEnd: "өгнө",
    description:
      "Спа, фитнес, зочид буудлын карт эсвэл аялалын тур. Төрсөн өдөр, баяр, корпоративд тохиромжтой.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85",
  },
];

const AUTOPLAY_MS = 6000;

export function HeroSection({
  heroBlurDataURL,
}: {
  heroBlurDataURL?: string;
} = {}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      const next = i % SLIDES.length;
      return next < 0 ? next + SLIDES.length : next;
    });
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, isPaused, goTo]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      aria-labelledby="hero-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary"
              aria-hidden
            >
              <span className="size-1.5 rounded-full bg-primary" />
              {slide.badge}
            </p>
            <h1
              id="hero-heading"
              className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl sm:leading-[1.12] lg:text-[3.25rem] lg:leading-[1.1] xl:text-6xl"
            >
              {slide.title}{" "}
              <span className="relative text-primary">
                <span className="relative z-10">{slide.titleHighlight}</span>
                <span
                  className="absolute bottom-0.5 left-0 right-0 h-2 bg-primary/20 -z-0"
                  aria-hidden
                />
              </span>
              {slide.titleEnd ? ` ${slide.titleEnd}` : ""}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/80">
              {slide.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                size="lg"
                className="min-h-12 rounded-2xl bg-primary px-7 py-6 text-base font-semibold shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/gifts" className="inline-flex items-center gap-2">
                  <Gift className="size-5 shrink-0" aria-hidden />
                  Бэлгийн карт худалдаж авах
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="min-h-12 rounded-2xl border border-foreground/20 px-7 py-6 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/gifts" className="inline-flex items-center gap-2">
                  Ангилал сонгох
                  <ChevronRight className="size-5 shrink-0" aria-hidden />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-foreground/60">
              50+ орон нутгийн бизнес · Төлбөр аюулгүй
            </p>
            {/* Slider controls - dots */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex gap-2" role="tablist" aria-label="Hero слайд сонгох">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Слайд ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      i === index
                        ? "w-8 bg-primary"
                        : "w-2 bg-foreground/25 hover:bg-foreground/40"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full border-foreground/20"
                  onClick={prev}
                  aria-label="Өмнөх слайд"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full border-foreground/20"
                  onClick={next}
                  aria-label="Дараагийн слайд"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="group relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-foreground/5 lg:aspect-[6/5] lg:rounded-3xl">
                {SLIDES.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500 ease-out",
                      i === index ? "z-0 opacity-100" : "z-[-1] opacity-0"
                    )}
                  >
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      placeholder={heroBlurDataURL && i === 0 ? "blur" : "empty"}
                      blurDataURL={i === 0 ? heroBlurDataURL : undefined}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-foreground/5 to-transparent" />
              </div>
              <div
                className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-80"
                aria-hidden
              />
              <div className="absolute -bottom-4 left-0 right-0 flex flex-wrap justify-center gap-3 px-4 lg:bottom-6 lg:left-6 lg:right-auto lg:flex-col lg:px-0">
                {FLOATING_BADGES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-foreground/10 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-md",
                      "transition-all duration-200 hover:scale-[1.02] hover:border-primary/20 hover:bg-background hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
