import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_BLUR } from "@/lib/blur-constants";
import { cn } from "@/lib/utils";

const EXPERIENCES = [
  {
    title: "Ресторанд хооллох",
    category: "Ресторан",
    price: "50,000₮-аас",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    alt: "Ресторанд хооллох туршлага",
    href: "/gifts?category=Restaurant",
  },
  {
    title: "Кофе & жигнэмэг",
    category: "Кофе шоп",
    price: "25,000₮-аас",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    alt: "Кофе, жигнэмэг",
    href: "/gifts?category=Coffee%20Shop",
  },
  {
    title: "Спа & эрүүл мэнд",
    category: "Гоо сайхан & Спа",
    price: "80,000₮-аас",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    alt: "Спа, эрүүл мэндийн үйлчилгээ",
    href: "/gifts?category=Beauty%20%26%20Spa",
  },
  {
    title: "Зочид буудла & амраалт",
    category: "Зочид буудла",
    price: "150,000₮-аас",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    alt: "Зочид буудлын амраалт",
    href: "/gifts?category=Hotel",
  },
];

export function FeaturedExperiences() {
  return (
    <section
      id="featured-experiences"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="featured-experiences-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="featured-experiences-heading"
          className="text-3xl font-bold text-foreground sm:text-4xl"
        >
          Ангилалаар сонгох
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Монгол дахь найдвартай бизнесүүдээс ангилалаар нь сонгоно уу.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {EXPERIENCES.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              )}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={FALLBACK_BLUR}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-opacity duration-500 transition-transform group-hover:scale-105"
                  priority={index < 4}
                  loading={index < 4 ? undefined : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute left-4 top-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur">
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-white/90">
                    {item.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
