import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Gift } from "@/lib/types";
import { apiGet } from "@/lib/api/client";
import { GiftEditForm } from "./GiftEditForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let gift: Gift | null = null;
  try {
    const res = await apiGet<Gift & { merchant?: unknown }>(`/api/gifts/${slug}`);
    gift = res;
  } catch {
    // 404
  }
  return {
    title: gift ? `${gift.title} — Засах` : "Бэлгийн карт засах",
  };
}

export default async function MerchantGiftEditPage({ params }: PageProps) {
  const { slug } = await params;
  let gift: Gift;
  try {
    const res = await apiGet<Gift & { merchant?: unknown }>(`/api/gifts/${slug}`);
    gift = res;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href={`/merchant/dashboard/gifts/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Дэлгэрэнгүй руу буцах
        </Link>
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-foreground">
          Карт засах: {gift.title}
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Slug: {gift.slug} (өөрчлөхгүй)
        </p>
        <div className="mt-6">
          <GiftEditForm slug={slug} gift={gift} />
        </div>
      </div>
    </div>
  );
}
