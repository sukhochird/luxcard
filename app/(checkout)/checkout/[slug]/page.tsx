import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiGet } from "@/lib/api/client";
import type { Gift } from "@/lib/types";
import { CheckoutProcessStepper } from "@/components/checkout/CheckoutProcessStepper";
import { CheckoutForm } from "./CheckoutForm";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const amountParam = resolvedSearch.amount;
  const amount = amountParam
    ? parseInt(Array.isArray(amountParam) ? amountParam[0] : amountParam, 10)
    : null;

  let gift: Gift;
  try {
    gift = await apiGet<Gift>(`/api/gifts/${slug}`);
  } catch {
    notFound();
  }

  const selectedAmount =
    amount && gift.priceOptions.includes(amount)
      ? amount
      : Math.min(...gift.priceOptions);

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href={`/gifts/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Буцах
      </Link>
      <CheckoutProcessStepper currentStep={1} className="mt-6 mb-8" />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Захиалга</h1>
      <div className="mt-4 flex gap-4 py-2">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
          <Image
            src={gift.image}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{gift.merchant}</p>
          <p className="text-sm text-foreground/70">{gift.title}</p>
          <p className="mt-1 text-lg font-semibold text-primary">
            {selectedAmount.toLocaleString()}₮
          </p>
        </div>
      </div>
      <CheckoutForm
        slug={slug}
        amount={selectedAmount}
        merchant={gift.merchant}
      />
    </div>
  );
}
