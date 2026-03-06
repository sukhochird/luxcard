import Image from "next/image";
import Link from "next/link";
import { FALLBACK_BLUR } from "@/lib/blur-constants";
import { cn } from "@/lib/utils";

const OCCASIONS = [
  {
    name: "Birthday",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    alt: "Birthday celebration",
    href: "/gifts?occasion=Birthday",
  },
  {
    name: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    alt: "Wedding celebration",
    href: "/gifts?occasion=Wedding",
  },
  {
    name: "New Year",
    image:
      "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80",
    alt: "New Year celebration",
    href: "/gifts?occasion=New%20Year",
  },
  {
    name: "Valentine's",
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
    alt: "Valentine's day",
    href: "/gifts?occasion=Valentine%27s",
  },
  {
    name: "Corporate",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    alt: "Corporate gifting",
    href: "/gifts?occasion=Corporate",
  },
];

export function PopularOccasions() {
  return (
    <section
      id="categories"
      className="border-t border-foreground/10 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="occasions-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="occasions-heading"
          className="text-3xl font-bold text-foreground sm:text-4xl"
        >
          Popular occasions
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Find the right gift card for every celebration.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {OCCASIONS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              )}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={FALLBACK_BLUR}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-opacity duration-500 transition-all duration-300 group-hover:scale-105 group-hover:brightness-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/50 transition-colors duration-300 group-hover:bg-foreground/60" />
                <div className="absolute inset-0 flex items-end p-6">
                  <span className="text-xl font-bold text-white drop-shadow-md">
                    {item.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
