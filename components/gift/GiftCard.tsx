"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { FadeImage } from "@/components/image/FadeImage";
import type { Gift } from "@/lib/types";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
const CR80_ASPECT = 85.6 / 53.98;

interface GiftCardProps {
  item: Gift;
  className?: string;
  priority?: boolean;
}

function GiftCardComponent({ item, className, priority }: GiftCardProps) {
  const [imgSrc, setImgSrc] = useState(item.image);
  const [isFavorite, setIsFavorite] = useState(false);
  const minPrice = Math.min(...item.priceOptions);
  const isLocal = imgSrc.startsWith("/");

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      href={`/gifts/${item.slug}`}
      className={cn(
        "group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl",
        className
      )}
      aria-label={`${item.title} бэлгийн карт үзэх`}
    >
      {/* Image container */}
      <div
          className="relative w-full overflow-hidden rounded-xl bg-foreground/5"
          style={{ aspectRatio: CR80_ASPECT }}
        >
        <FadeImage
          src={imgSrc}
          alt={`${item.merchant} — ${item.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder={isLocal ? "blur" : "empty"}
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />

        {/* Badge - top left */}
        {item.featured && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
              Онцгой хамтрагч
            </span>
          </div>
        )}

        {/* Favorite button - top right */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none"
          aria-label={isFavorite ? "Дуртай жагсаалтаас хасах" : "Дуртай жагсаалтад нэмэх"}
        >
          <Heart
            className={cn(
              "size-6 drop-shadow-md transition-colors",
              isFavorite
                ? "fill-red-500 text-red-500"
                : "fill-foreground/30 text-white stroke-white stroke-2"
            )}
          />
        </button>

        {/* Dot indicators (for multiple images) */}
        {item.images && item.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {item.images.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === 0 ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight line-clamp-1">
            {item.title}
          </h3>
        </div>
        <p className="text-sm text-foreground/60 line-clamp-1">
          {item.merchant} • {item.location}
        </p>
        <p className="mt-1 text-sm text-foreground">
          <span className="font-semibold">{minPrice.toLocaleString()}₮</span>
          <span className="text-foreground/60">-с эхлэн</span>
        </p>
      </div>
    </Link>
  );
}

export const GiftCard = memo(GiftCardComponent);
