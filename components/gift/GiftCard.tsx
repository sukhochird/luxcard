"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
  const minPrice = Math.min(...item.priceOptions);
  const isLocal = imgSrc.startsWith("/");

  return (
    <Link
      href={`/gifts/${item.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background p-4 shadow transition-all duration-200 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      aria-label={`View ${item.title} gift card details`}
    >
      <div
        className="relative w-full overflow-hidden rounded-xl bg-foreground/5"
        style={{ aspectRatio: CR80_ASPECT }}
      >
        <FadeImage
          src={imgSrc}
          alt={`${item.merchant} — ${item.title}`}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder={isLocal ? "blur" : "empty"}
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs backdrop-blur-sm">
            {item.category}
          </Badge>
          {item.featured && (
            <Badge className="bg-primary text-white backdrop-blur-sm">
              Featured
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-bold text-foreground">{item.title}</h3>
        <p className="mt-0.5 text-sm text-foreground/70">{item.merchant}</p>
        <p className="mt-1 text-xs text-foreground/60">{item.location}</p>
        <p className="mt-3 text-lg font-semibold text-foreground">
          From {minPrice.toLocaleString()}₮
        </p>
      </div>
    </Link>
  );
}

export const GiftCard = memo(GiftCardComponent);
