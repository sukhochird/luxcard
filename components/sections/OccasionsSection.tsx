"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { GiftOccasion } from "@/lib/types";

const OCCASIONS: {
  key: GiftOccasion;
  label: string;
  image: string;
}[] = [
  {
    key: "Birthday",
    label: "Төрсөн өдөр",
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80",
  },
  {
    key: "Wedding",
    label: "Гэрлэлт",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
  },
  {
    key: "New Year",
    label: "Шинэ жил",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80",
  },
  {
    key: "Lunar New Year",
    label: "Сар шинийн баяр",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80",
  },
  {
    key: "Valentine's",
    label: "Валентины өдөр",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
  },
  {
    key: "Mother's Day",
    label: "Ээжийн өдөр",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
  },
  {
    key: "Father's Day",
    label: "Аавын өдөр",
    image: "https://images.unsplash.com/photo-1610088441520-4352457e7095?w=400&q=80",
  },
  {
    key: "Holiday",
    label: "Амралт",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80",
  },
  {
    key: "Corporate",
    label: "Корпоратив",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
  },
  {
    key: "Graduation",
    label: "Төгсөлт",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80",
  },
  {
    key: "Housewarming",
    label: "Гэр шинэчлэлт",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  },
  {
    key: "Baby Shower",
    label: "Хүүхэд төрөх баяр",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
  },
  {
    key: "Thank You",
    label: "Талархал",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80",
  },
  {
    key: "Get Well Soon",
    label: "Эрүүл мэнд",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
  },
  {
    key: "Congratulations",
    label: "Баяр хүргэх",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
  },
];

export function OccasionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = 160;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="occasions"
      className="border-t border-foreground/10 bg-background px-4 py-6 sm:px-6 lg:px-8"
      aria-labelledby="occasions-heading"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2
              id="occasions-heading"
              className="text-xl font-bold text-foreground sm:text-2xl"
            >
              Баяр ёслол
            </h2>
            <p className="mt-0.5 text-sm text-foreground/70">
              Ямар үйл явдлын бэлэг хайж байна вэ?
            </p>
          </div>
          <div className="flex shrink-0 gap-1" aria-hidden="true">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Зүүн тийш гүйлгэх"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Баруун тийш гүйлгэх"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {OCCASIONS.map(({ key, label, image }) => (
            <Link
              key={key}
              href={`/gifts?occasion=${encodeURIComponent(key)}`}
              className="group flex shrink-0 snap-center flex-col rounded-2xl border-2 border-transparent bg-background shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="listitem"
              style={{ width: "140px" }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-foreground/5">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="rounded-b-xl px-2.5 py-2 text-center text-sm font-medium text-foreground">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
