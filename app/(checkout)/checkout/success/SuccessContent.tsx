"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckoutProcessStepper } from "@/components/checkout/CheckoutProcessStepper";
import { useCart } from "@/store/cart";

interface SuccessContentProps {
  orderId: string;
  redeemCode: string;
}

export function SuccessContent({ orderId, redeemCode }: SuccessContentProps) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId) clearCart();
  }, [orderId, clearCart]);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutProcessStepper currentStep={3} className="mb-8" />
      <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          Захиалга баталгаажлаа
        </h1>
        <p className="mt-2 text-foreground/80">
          Бэлгийн картын захиалга амжилттай боллоо.
        </p>
        <dl className="mt-6 space-y-3">
          <div>
            <dt className="text-sm font-medium text-foreground/70">
              Захиалгын дугаар
            </dt>
            <dd className="mt-1 font-mono text-foreground">
              {orderId || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-foreground/70">
              Ашиглах код
            </dt>
            <dd className="mt-1 font-mono text-foreground">
              {redeemCode || "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-foreground/70">
          Хүлээн авагч бэлгийн карт болон энэ кодыг имэйлээр хүлээн авах болно.
        </p>
        <div className="mt-8">
          <Button size="lg" className="rounded-2xl bg-primary hover:bg-primary/90" asChild>
            <Link href="/gifts">Бэлгийн картуудыг үзэх</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
