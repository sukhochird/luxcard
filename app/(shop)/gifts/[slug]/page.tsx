import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api/client";
import type { Gift, GiftWithMerchant } from "@/lib/types";
import { ImageCarousel } from "./ImageCarousel";
import { GiftDetailPanel } from "./GiftDetailPanel";
import { GiftDetailsSection } from "./GiftDetailsSection";
import { SimilarGiftCards } from "./SimilarGiftCards";
import { GiftDetailFAQ } from "./GiftDetailFAQ";
import { GiftDetailFlowDiagram } from "./GiftDetailFlowDiagram";

const SITE_URL = "https://luxcard.mn";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let card: GiftWithMerchant;
  try {
    card = await apiGet<GiftWithMerchant>(`/api/gifts/${slug}`);
  } catch {
    return { title: "Бэлгийн карт олдсонгүй" };
  }
  const title = card.title;
  const merchant = card.merchant?.companyName ?? card.title;
  const minPrice = Math.min(...card.priceOptions);
  const description =
    card.description?.slice(0, 160)?.trim()?.replace(/\s+/g, " ") ||
    `${title} — ${merchant}. ${minPrice.toLocaleString()}₮-с эхлэн. Монгол дахь бэлгийн карт.`;
  const image = card.images?.[0] ?? card.image;
  const canonical = `${SITE_URL}/gifts/${slug}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} — LuxCard`,
      description,
      type: "website",
      url: canonical,
      images: image ? [{ url: imageUrl, alt: title }] : undefined,
      locale: "mn_MN",
      siteName: "LuxCard",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — LuxCard`,
      description,
      images: image ? [imageUrl] : undefined,
    },
  };
}

function ProductJsonLd({ gift, url }: { gift: Gift; url: string }) {
  const minPrice = Math.min(...gift.priceOptions);
  const image = gift.images?.[0] ?? gift.image;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: gift.title,
    description: gift.description?.slice(0, 500) || `${gift.title} — ${gift.merchant}`,
    image: imageUrl,
    brand: { "@type": "Brand", name: gift.merchant },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "MNT",
      price: minPrice,
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd({ title, slug }: { title: string; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Нүүр", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Бэлгийн картууд", item: `${SITE_URL}/gifts` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/gifts/${slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
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
  const canonicalUrl = `${SITE_URL}/gifts/${slug}`;

  // Ижил ангилалтай бусад картууд (санал болгох)
  let similarGifts: Gift[] = [];
  try {
    const res = await apiGet<{ items: Gift[] }>(
      `/api/gifts?category=${encodeURIComponent(gift.category)}&limit=8`
    );
    similarGifts = res.items;
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ProductJsonLd gift={gift} url={canonicalUrl} />
      <BreadcrumbJsonLd title={gift.title} slug={slug} />
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

      <SimilarGiftCards gifts={similarGifts} currentSlug={slug} />
      <GiftDetailFAQ />
      <GiftDetailFlowDiagram />
    </div>
  );
}
