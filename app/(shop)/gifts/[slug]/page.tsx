import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api/client";
import type { Gift, GiftWithMerchant } from "@/lib/types";
import { ImageCarousel } from "./ImageCarousel";
import { GiftDetailPanel } from "./GiftDetailPanel";
import { GiftDetailsSection } from "./GiftDetailsSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GiftDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let card: GiftWithMerchant;
  try {
    card = await apiGet<GiftWithMerchant>(`/api/gifts/${slug}`);
  } catch {
    notFound();
  }

  const gift: Gift = {
    ...card,
    merchant: card.merchant?.companyName ?? card.title,
  };
  const images = gift.images?.length ? gift.images : [gift.image];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-foreground/70">
          <li>
            <Link
              href="/gifts"
              className="rounded font-medium text-primary transition-colors hover:text-primary/90 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Бэлгүүд
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground" aria-current="page">
            {gift.title}
          </li>
        </ol>
      </nav>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0 flex flex-col gap-6 lg:max-w-[580px]">
          <ImageCarousel images={images} alt={gift.title} />
          <GiftDetailsSection gift={gift} />
        </div>
        <div className="min-w-0 pb-28 lg:pb-0">
          <GiftDetailPanel card={card} />
        </div>
      </article>
    </div>
  );
}
