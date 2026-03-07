import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Gift } from "@/lib/types";
import { apiGet } from "@/lib/api/client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let gift: Gift | null = null;
  try {
    const res = await apiGet<Gift>(`/api/gifts/${slug}`);
    gift = res;
  } catch {
    // 404 handled in page
  }
  return {
    title: gift ? `${gift.title} — Удирдах` : "Бэлгийн карт",
  };
}

export default async function MerchantGiftShowPage({ params }: PageProps) {
  const { slug } = await params;
  let gift: Gift;
  try {
    const res = await apiGet<Gift>(`/api/gifts/${slug}`);
    gift = res;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/merchant/dashboard/gifts"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Жагсаалт руу буцах
        </Link>
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
        {/* Image */}
        <div
          className="h-48 sm:h-56 bg-foreground/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${gift.image})` }}
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {gift.title}
              </h1>
              <p className="mt-1 text-foreground/70">{gift.merchant}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{gift.category}</Badge>
                <Badge variant="outline">{gift.location}</Badge>
                {gift.featured && (
                  <Badge className="bg-primary/20 text-primary">
                    Онцлох
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" asChild>
                <Link
                  href={`/merchant/dashboard/gifts/${slug}/edit`}
                  className="gap-2"
                >
                  <Pencil className="size-4" />
                  Засах
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/gifts/${slug}`} className="gap-2" target="_blank">
                  <ExternalLink className="size-4" />
                  Дэлгүүрт харах
                </Link>
              </Button>
            </div>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Үнийн сонголтууд (₮)
              </dt>
              <dd className="mt-1 text-foreground">
                {gift.priceOptions
                  .slice()
                  .sort((a, b) => a - b)
                  .map((p) => p.toLocaleString())
                  .join(", ")}
                ₮
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Хөнгөлөлт
              </dt>
              <dd className="mt-1 text-foreground">
                {gift.discountPercent != null
                  ? `${gift.discountPercent}%`
                  : "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Тохирох үзэгдэл
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {gift.occasion.length > 0 ? (
                  gift.occasion.map((o) => (
                    <Badge key={o} variant="outline" className="font-normal">
                      {o}
                    </Badge>
                  ))
                ) : (
                  <span className="text-foreground/60">—</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Тайлбар
              </dt>
              <dd className="mt-1 text-foreground/90 whitespace-pre-wrap">
                {gift.description || "—"}
              </dd>
            </div>
            {gift.howToUse && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  Хэрхэн ашиглах
                </dt>
                <dd className="mt-1 text-foreground/80 text-sm whitespace-pre-wrap">
                  {gift.howToUse}
                </dd>
              </div>
            )}
            {gift.termsOfUse && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  Ашиглах нөхцөл
                </dt>
                <dd className="mt-1 text-foreground/80 text-sm whitespace-pre-wrap">
                  {gift.termsOfUse}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
