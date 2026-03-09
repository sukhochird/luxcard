"use client";

import { useState, useMemo, memo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Gift, GiftWithMerchant, PackagingId } from "@/lib/types";
import { useCart } from "@/store/cart";
import {
  PackagingSelection,
  getAddonsModifier,
} from "./PackagingSelection";
import { PriceSelector } from "./PriceSelector";
import { TrustIndicators } from "./TrustIndicators";
import { MerchantInfo } from "./MerchantInfo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { X, Share2, Heart, ShoppingCart, CreditCard } from "lucide-react";

const DESCRIPTION_TRUNCATE = 180;

function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > DESCRIPTION_TRUNCATE;
  const text =
    isLong && !expanded
      ? `${description.slice(0, DESCRIPTION_TRUNCATE).trim()}…`
      : description;

  return (
    <div className="prose prose-sm max-w-none text-foreground/80">
      <p>{text}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-expanded={expanded}
        >
          Дэлгэрэнгүй унших
        </button>
      )}
      <p className="mt-3 border-t border-foreground/10 pt-3 text-sm">
        Худалдаа эрхлэгчийн салбар эсвэл онлайнаар ашиглана. Худалдан авахаас
        хойш 12 сар хүчинтэй. Нөхцөл хэрэгжинэ.
      </p>
    </div>
  );
}

interface GiftDetailPanelProps {
  /** Card from API: gift + merchant. Modal info comes only from this. */
  card: GiftWithMerchant;
}

function GiftDetailPanelComponent({ card }: GiftDetailPanelProps) {
  const gift: Gift = useMemo(
    () => ({
      ...card,
      merchant: card.merchant?.companyName ?? card.title,
    }),
    [card]
  );
  const merchant = card.merchant ?? undefined;
  const router = useRouter();
  const { addItem } = useCart();
  const [addons, setAddons] = useState<PackagingId[]>([]);
  const [amount, setAmount] = useState(() => Math.min(...gift.priceOptions));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const merchantModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!merchantModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMerchantModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [merchantModalOpen]);

  const modifier = useMemo(() => getAddonsModifier(addons), [addons]);
  const discount = gift.discountPercent ?? 0;
  const unitPriceBeforeDiscount = amount;
  const unitPriceAfterDiscount = Math.round(
    amount * (1 - discount / 100)
  );
  const subtotalUnits = unitPriceAfterDiscount * quantity;
  const total = subtotalUnits + modifier * quantity;
  const hasDiscount = discount > 0;

  const handleAddToCart = () => {
    addItem({
      slug: gift.slug,
      amount,
      addons,
      quantity,
      title: gift.title,
      merchant: gift.merchant,
      image: gift.image,
      discountPercent: gift.discountPercent,
    });
    setAdded(true);
    toast.success("Сагсанд нэмэгдлээ", {
      description: `${gift.title} · ${quantity} ширхэг`,
    });
    setTimeout(() => setAdded(false), 2800);
  };

  const handleBuyNow = () => {
    addItem({
      slug: gift.slug,
      amount,
      addons,
      quantity,
      title: gift.title,
      merchant: gift.merchant,
      image: gift.image,
      discountPercent: gift.discountPercent,
    });
    router.push("/checkout");
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${gift.title} — ${gift.merchant}`;
    const text = `${gift.title}. ${gift.merchant}, ${gift.location}.`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
        setShareDone(true);
        setTimeout(() => setShareDone(false), 2000);
      } else {
        await navigator.clipboard?.writeText(url);
        setShareDone(true);
        setTimeout(() => setShareDone(false), 2000);
      }
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setShareDone(true);
        setTimeout(() => setShareDone(false), 2000);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-8 lg:sticky lg:top-24">
        <div className="flex flex-wrap gap-2">
          <Badge className="border-primary bg-primary/10 text-primary">
            {gift.category}
          </Badge>
          {gift.featured && (
            <Badge variant="outline" className="text-foreground/60">
              Онцлох
            </Badge>
          )}
          {gift.occasion.map((occ) => (
            <Badge key={occ} variant="outline" className="text-foreground/60">
              {occ}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl min-w-0">
            {gift.title}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10",
                shareDone && "text-primary"
              )}
              onClick={handleShare}
              aria-label={shareDone ? "Холбоос хуулагдсан" : "Хуваалцах"}
            >
              <Share2 className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10",
                isFavorite && "text-red-500 hover:text-red-500"
              )}
              onClick={() => setIsFavorite((f) => !f)}
              aria-label={isFavorite ? "Дуртай жагсаалтаас хасах" : "Дуртай жагсаалтад нэмэх"}
            >
              <Heart
                className={cn("size-5", isFavorite && "fill-current")}
              />
            </Button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-foreground/80">{gift.merchant}</p>
          <span className="text-foreground/40" aria-hidden>·</span>
          <p className="text-sm text-foreground/70">{gift.location}</p>
          {merchant && (
            <>
              <span className="text-foreground/40" aria-hidden>·</span>
              <button
                type="button"
                onClick={() => setMerchantModalOpen(true)}
                className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                Байршил болон мэдээлэл
              </button>
            </>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-foreground/60">Үнэ</p>
          <div className="flex flex-wrap items-baseline gap-2">
            {hasDiscount && (
              <span className="text-lg text-foreground/50 line-through">
                {unitPriceBeforeDiscount.toLocaleString()}₮
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              {unitPriceAfterDiscount.toLocaleString()}₮
            </span>
            {hasDiscount && (
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                −{discount}%
              </span>
            )}
          </div>
        </div>
        <div className="mt-6 border-t border-foreground/10 pt-6">
          <DescriptionSection description={gift.description} />
        </div>
        <div className="mt-6 border-t border-foreground/10 pt-6">
          <PriceSelector
            options={gift.priceOptions}
            value={amount}
            onChange={setAmount}
          />
        </div>
        <div className="mt-6">
          <PackagingSelection value={addons} onChange={setAddons} />
        </div>
        <div className="mt-6">
          <label
            htmlFor="quantity"
            className="block text-sm font-semibold text-foreground"
          >
            Тоо ширхэг
          </label>
          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="rounded-xl"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Тоо багасгах"
            >
              −
            </Button>
            <span
              id="quantity"
              className="min-w-[2rem] text-center font-medium"
              aria-live="polite"
            >
              {quantity}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="rounded-xl"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              aria-label="Тоо нэмэгдүүлэх"
            >
              +
            </Button>
          </div>
        </div>
        <div className="mt-6 border-t border-foreground/10 pt-6">
          <TrustIndicators />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ backgroundColor: "#0052FF" }}
            onClick={handleBuyNow}
            aria-label="Шууд авах"
          >
            <CreditCard className="size-5 shrink-0" aria-hidden />
            Шууд авах — {total.toLocaleString()}₮
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl transition-all duration-200",
              added && "bg-primary/10 text-primary"
            )}
            onClick={handleAddToCart}
            aria-label="Сагсанд нэмэх"
          >
            <ShoppingCart className="size-5 shrink-0" aria-hidden />
            {added ? "Нэмэгдсэн" : "Сагсанд нэмэх"}
          </Button>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-[100] flex items-center gap-3 border-t border-foreground/10 bg-background px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs text-foreground/60">Үнэ</p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {total.toLocaleString()}₮
          </p>
        </div>
        <Button
          size="lg"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-5 font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          style={{ backgroundColor: "#0052FF" }}
          onClick={handleBuyNow}
        >
          <CreditCard className="size-5 shrink-0" aria-hidden />
          Шууд авах
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-2xl"
          onClick={handleAddToCart}
          aria-label={added ? "Нэмэгдсэн" : "Сагсанд хийх"}
        >
          <ShoppingCart className={cn("size-5", added && "text-primary")} />
        </Button>
      </div>

      {merchantModalOpen && merchant && (
        <div
          ref={merchantModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="merchant-modal-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setMerchantModalOpen(false)}
        >
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-background shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-foreground/10 bg-background px-4 py-3">
              <h2 id="merchant-modal-heading" className="text-lg font-semibold text-foreground">
                Байршил болон мэдээлэл
              </h2>
              <button
                type="button"
                onClick={() => setMerchantModalOpen(false)}
                className="rounded-lg p-2 text-foreground/70 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Хаах"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-4">
              <MerchantInfo merchant={merchant} showTrustBadges={false} noFrame />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const GiftDetailPanel = memo(GiftDetailPanelComponent);
