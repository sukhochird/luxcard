"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, Store, Gift, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const PROGRESS_DURATION_MS = 5000;
const PROGRESS_TICK_MS = 50;
const BANNER_DURATION_MS = 5000;

/** Түр hero контентыг нуух — зөвхөн баннер, доор нь шууд Баяр ёслол */
const HERO_CONTENT_HIDDEN = true;

const BANNER_SLIDES = [
  {
    id: 1,
    image:
      "https://rewards.coingate.com/_next/image?url=https%3A%2F%2Fdistributedrewards-production.s3.amazonaws.com%2Fuploads%2Fpromo_banner%2F38%2Fd9cd2a18-394b-42c9-904b-07f60730e1cc.png&w=3840&q=90",
    alt: "Promo banner",
    href: "/gifts",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&q=85",
    alt: "Бэлгийн карт",
    href: "/gifts",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=85",
    alt: "Онцлон санал",
    href: "/categories",
  },
];

const FLOATING_BADGES = [
  { icon: Clock, label: "Шууд хүргэлт" },
  { icon: ShieldCheck, label: "Аюулгүй төлбөр" },
  { icon: Store, label: "Баталгаат дэлгүүрүүд" },
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

export function HeroSection({
  heroBlurDataURL,
}: {
  heroBlurDataURL?: string;
} = {}) {
  const [index, setIndex] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(1);
  const startTimeRef = useRef<number>(Date.now());

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      const next = i % SLIDES.length;
      return next < 0 ? next + SLIDES.length : next;
    });
    setProgress(1);
    startTimeRef.current = Date.now();
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / PROGRESS_DURATION_MS);
      setProgress(remaining);
      if (remaining <= 0) goTo(index + 1);
    }, PROGRESS_TICK_MS);
    return () => clearInterval(t);
  }, [index, isPaused, goTo]);

  useEffect(() => {
    if (BANNER_SLIDES.length <= 1) return;
    const t = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, BANNER_DURATION_MS);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  const goToBanner = useCallback((i: number) => {
    setBannerIndex((prev) => {
      const n = BANNER_SLIDES.length;
      const next = ((i % n) + n) % n;
      return next;
    });
  }, []);
  const nextBanner = useCallback(() => goToBanner(bannerIndex + 1), [bannerIndex, goToBanner]);
  const prevBanner = useCallback(() => goToBanner(bannerIndex - 1), [bannerIndex, goToBanner]);

  const bannerDragStartX = useRef(0);
  const bannerJustDragged = useRef(false);
  const handleBannerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      bannerDragStartX.current = e.clientX;
      bannerJustDragged.current = false;
      const onUp = (upEvent: MouseEvent) => {
        document.removeEventListener("mouseup", onUp);
        const dx = upEvent.clientX - bannerDragStartX.current;
        if (Math.abs(dx) > 50) {
          bannerJustDragged.current = true;
          if (dx > 0) prevBanner();
          else nextBanner();
        }
      };
      document.addEventListener("mouseup", onUp);
    },
    [prevBanner, nextBanner]
  );
  const handleBannerLinkClick = useCallback((e: React.MouseEvent) => {
    if (bannerJustDragged.current) {
      e.preventDefault();
      bannerJustDragged.current = false;
    }
  }, []);

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-0 mt-4 px-4 sm:px-6 lg:px-8 sm:mt-6",
        HERO_CONTENT_HIDDEN ? "pb-4" : "pb-14 sm:pb-20 lg:pb-24"
      )}
      aria-labelledby={HERO_CONTENT_HIDDEN ? undefined : "hero-heading"}
      onMouseEnter={HERO_CONTENT_HIDDEN ? undefined : () => setIsPaused(true)}
      onMouseLeave={HERO_CONTENT_HIDDEN ? undefined : () => setIsPaused(false)}
      onFocus={HERO_CONTENT_HIDDEN ? undefined : () => setIsPaused(true)}
      onBlur={HERO_CONTENT_HIDDEN ? undefined : () => setIsPaused(false)}
    >
      {/* Top banner slider — header-ын доор зайгүй, section-ийн зайд */}
      <div className="mx-auto max-w-7xl">
        <div
          className="group relative w-full cursor-grab overflow-hidden rounded-xl bg-foreground/5 active:cursor-grabbing"
          onMouseDown={BANNER_SLIDES.length > 1 ? handleBannerMouseDown : undefined}
        >
          <div className="relative aspect-[32/9] w-full min-h-[140px] sm:min-h-[160px] md:min-h-[200px]">
            {BANNER_SLIDES.map((banner, i) => (
              <Link
                key={banner.id}
                href={banner.href}
                onClick={handleBannerLinkClick}
                className={cn(
                  "absolute inset-0 block transition-opacity duration-500",
                  i === bannerIndex ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
                )}
                aria-hidden={i !== bannerIndex}
              >
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority={i === 0}
                />
              </Link>
            ))}
          </div>
          {BANNER_SLIDES.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 z-20 size-9 -translate-y-1/2 rounded-full border-0 bg-black/40 shadow-md opacity-0 transition-opacity hover:bg-black/60 focus-visible:ring-2 group-hover:opacity-100"
                aria-label="Өмнөх баннер"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevBanner();
                }}
              >
                <ChevronLeft className="size-5 text-white" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 z-20 size-9 -translate-y-1/2 rounded-full border-0 bg-black/40 shadow-md opacity-0 transition-opacity hover:bg-black/60 focus-visible:ring-2 group-hover:opacity-100"
                aria-label="Дараагийн баннер"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextBanner();
                }}
              >
                <ChevronRight className="size-5 text-white" />
              </Button>
              <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                {BANNER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Баннер ${i + 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToBanner(i);
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === bannerIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {!HERO_CONTENT_HIDDEN && (
        <>
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl pt-10 sm:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary"
              aria-hidden
            >
              <span className="size-1.5 rounded-full bg-primary" />
              {slide.badge}
            </p>
            <p className="mt-2 text-sm font-bold text-foreground sm:text-base">
              50+ оронд · Төлбөр аюулгүй
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
                  <span className="hidden lg:inline">Бэлгийн карт </span>
                  Худалдаж авах
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="min-h-12 rounded-2xl px-7 py-6 text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/gifts" className="inline-flex items-center gap-2">
                  Ангилал сонгох
                  <ChevronRight className="size-5 shrink-0" aria-hidden />
                </Link>
              </Button>
            </div>
            {/* Slider controls - pagination label + dots + progress */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-foreground/70 tabular-nums" aria-hidden>
                {index + 1} / {SLIDES.length}
              </span>
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
                      "relative h-2 overflow-hidden rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      i === index ? "w-10" : "w-2 bg-foreground/25 hover:bg-foreground/40"
                    )}
                  >
                    {i === index && (
                      <span
                        className="absolute inset-0 rounded-full bg-primary transition-none"
                        style={{
                          transform: `scaleX(${progress})`,
                          transformOrigin: "left",
                        }}
                        aria-hidden
                      />
                    )}
                  </button>
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
                      "flex items-center gap-3 rounded-xl border border-foreground/15 bg-white/90 px-4 py-3 shadow-lg shadow-black/15 backdrop-blur-xl dark:bg-background/90",
                      "transition-all duration-200 hover:scale-[1.02] hover:border-primary/20 hover:bg-background/98 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
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
        </>
      )}
    </section>
  );
}
