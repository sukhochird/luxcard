import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { apiGet } from "@/lib/api/client";
import type { Gift } from "@/lib/types";

const CATEGORY_ORDER: Gift["category"][] = [
  "Restaurant",
  "Coffee Shop",
  "Beauty & Spa",
  "Hotel",
  "Fitness",
  "Entertainment",
  "Travel",
  "Retail",
];

const CATEGORY_LABELS: Record<Gift["category"], string> = {
  Restaurant: "Ресторан",
  "Coffee Shop": "Кофе шоп",
  "Beauty & Spa": "Гоо сайхан & Спа",
  Hotel: "Зочид буудла",
  Fitness: "Фитнес",
  Entertainment: "Энтертайнмент",
  Travel: "Аялал",
  Retail: "Жижиглэн",
};

const MAX_COLUMNS = 3;
const MAX_ITEMS_PER_COLUMN = 5;

function groupByCategory(gifts: Gift[]): Map<Gift["category"], Gift[]> {
  const map = new Map<Gift["category"], Gift[]>();
  for (const g of gifts) {
    const list = map.get(g.category) ?? [];
    list.push(g);
    map.set(g.category, list);
  }
  return map;
}

function buildColumns(gifts: Gift[]): { category: Gift["category"]; items: Gift[] }[] {
  const byCategory = groupByCategory(gifts);
  const columns: { category: Gift["category"]; items: Gift[] }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const items = byCategory.get(cat);
    if (!items?.length) continue;
    const sorted = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    columns.push({ category: cat, items: sorted.slice(0, MAX_ITEMS_PER_COLUMN) });
    if (columns.length >= MAX_COLUMNS) break;
  }
  return columns;
}

export async function FeaturedGiftCardsSection() {
  const data = await apiGet<{ items: Gift[] }>("/api/gifts?limit=500");
  const gifts = data.items;
  const featuredFirst = [...gifts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const columns = buildColumns(featuredFirst);

  if (columns.length === 0) {
    return null;
  }

  return (
    <section
      id="featured-gift-cards"
      className="relative px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="featured-gift-cards-heading"
    >
      {/* Subtle background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 text-center">
          <h2
            id="featured-gift-cards-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]"
          >
            Онцлох бэлгийн картууд
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-foreground/65">
            Ангилалаар сонгосон Монгол дахь бизнесүүдийн бэлгийн картууд.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map(({ category, items }) => (
            <div
              key={category}
              className="group/card flex flex-col overflow-hidden rounded-3xl bg-background/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-lg hover:bg-background"
            >
              <div className="flex items-center gap-3 border-b border-foreground/[0.06] px-6 py-5">
                <span className="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <h3 className="text-lg font-bold text-foreground">
                  {CATEGORY_LABELS[category]}
                </h3>
              </div>
              <ul className="flex-1 p-3">
                {items.map((item) => {
                  const minPrice = Math.min(...item.priceOptions);
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/gifts/${item.slug}`}
                        className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        aria-label={`${item.merchant}, ${minPrice.toLocaleString()} төгрөгөөс`}
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-foreground/[0.06] shadow-inner">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {item.merchant}
                          </p>
                          <p className="mt-0.5 text-sm text-foreground/55 truncate">
                            {item.location}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-primary">
                            {minPrice.toLocaleString()}₮
                          </p>
                        </div>
                        {item.featured && (
                          <span className="shrink-0 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary">
                            Онцлох
                          </span>
                        )}
                        <ArrowRight className="size-5 shrink-0 text-foreground/25 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/gifts"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-[#0046e0] hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Бүгдийг харах
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
