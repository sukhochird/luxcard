"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Send, User } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPackagingModifier } from "@/app/(shop)/gifts/[slug]/PackagingSelection";
import type { PackagingId } from "@/lib/types";
import { cn } from "@/lib/utils";

type DeliveryType = "self" | "gift";
type SendOption = "now" | "scheduled";

const PHONE_REGEX = /^[0-9]{8}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("gift");
  const [sendOption, setSendOption] = useState<SendOption>("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPhoneTouched, setUserPhoneTouched] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userPhoneValid = PHONE_REGEX.test(userPhone.replace(/\s/g, ""));
  const userPhoneError =
    userPhoneTouched && userPhone.length > 0 && !userPhoneValid;

  const { subtotal } = useMemo(() => {
    let sub = 0;
    for (const item of items) {
      const packMod = getPackagingModifier(item.packaging as PackagingId);
      const unit = Math.round(
        item.amount * (1 - (item.discountPercent ?? 0) / 100)
      );
      sub += (unit + packMod) * item.quantity;
    }
    return { subtotal: sub };
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUserPhoneTouched(true);
    if (!userPhoneValid) return;
    if (deliveryType === "self" && !deliveryAddress.trim()) return;
    if (deliveryType === "gift" && (!recipientName.trim() || !recipientPhone.trim())) return;
    if (deliveryType === "gift" && sendOption === "scheduled" && !scheduledAt.trim()) {
      setError("Илгээх цаг сонгоно уу.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const orderId = `ORD-${Date.now()}`;
      const redeemCode = `LUX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(orderId)}&redeemCode=${encodeURIComponent(redeemCode)}`
      );
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <p className="text-foreground/80">Уншиж байна…</p>
      </div>
    );
  }

  const orderSummary = (
    <div className="rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Package className="size-4 text-primary" aria-hidden />
        Захиалгын тойм
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => {
          const packMod = getPackagingModifier(item.packaging as PackagingId);
          const unit = Math.round(
            item.amount * (1 - (item.discountPercent ?? 0) / 100)
          );
          const lineTotal = (unit + packMod) * item.quantity;
          return (
            <li
              key={`${item.slug}-${item.amount}-${item.packaging}`}
              className="flex gap-3"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-foreground/70">{item.merchant}</p>
                <p className="text-sm text-foreground/60">
                  ×{item.quantity} · {lineTotal.toLocaleString()}₮
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border-t border-foreground/10 pt-4">
        <p className="flex justify-between text-lg font-semibold text-foreground">
          <span>Нийт</span>
          <span>{subtotal.toLocaleString()}₮</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Сагс руу буцах
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
        Төлбөр
      </h1>
      <p className="mt-1 text-sm text-foreground/80 sm:text-base">
        Бэлгийн картын захиалгаа дуусгана уу.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 lg:flex lg:gap-10">
        <div className="min-w-0 flex-1 lg:max-w-xl">
          <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Send className="size-4 text-primary" aria-hidden />
              Хүргэлт
            </h2>
            <div className="mt-3 flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === "self"}
                  onChange={() => setDeliveryType("self")}
                  className="size-4 rounded-full border-foreground/30 text-primary focus:ring-primary"
                />
                <span className="text-foreground">Өөртөө ашиглах</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === "gift"}
                  onChange={() => setDeliveryType("gift")}
                  className="size-4 rounded-full border-foreground/30 text-primary focus:ring-primary"
                />
                <span className="text-foreground">Бэлэг болгон илгээх</span>
              </label>
            </div>
            {deliveryType === "self" && (
              <div className="mt-4">
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-foreground">
                  Хүргэлтийн хаяг <span className="text-red-500">*</span>
                </label>
                <Input
                  id="deliveryAddress"
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Гудамж, дүүрэг, хот"
                  className="mt-2"
                />
              </div>
            )}
            {deliveryType === "gift" && (
              <>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="recipientName" className="block text-sm font-medium text-foreground">
                      Хүлээн авагчийн нэр <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="recipientName"
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="recipientPhone" className="block text-sm font-medium text-foreground">
                      Утас <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="8 орон"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground">Илгээх цаг</p>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="sendOption"
                        checked={sendOption === "now"}
                        onChange={() => setSendOption("now")}
                        className="size-4 rounded-full border-foreground/30 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Одоо илгээх</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="sendOption"
                        checked={sendOption === "scheduled"}
                        onChange={() => setSendOption("scheduled")}
                        className="size-4 rounded-full border-foreground/30 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Товолсон цагт илгээх</span>
                    </label>
                  </div>
                  {sendOption === "scheduled" && (
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="mt-2 w-full max-w-xs"
                    />
                  )}
                </div>
              </>
            )}
            <div className="mt-6 border-t border-foreground/10 pt-6">
              <label htmlFor="userPhone" className="block text-sm font-medium text-foreground">
                Таны утас <span className="text-red-500">*</span>
              </label>
              <Input
                id="userPhone"
                type="tel"
                required
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                onBlur={() => setUserPhoneTouched(true)}
                placeholder="8 орон"
                className={cn("mt-2 max-w-xs", userPhoneError && "border-red-500 focus-visible:ring-red-500")}
                aria-invalid={userPhoneError}
                aria-describedby={userPhoneError ? "userPhone-error" : undefined}
              />
              {userPhoneError && (
                <p id="userPhone-error" className="mt-1.5 text-sm text-red-600" role="alert">
                  8 оронтой зөв утасны дугаар оруулна уу.
                </p>
              )}
              <p className="mt-3 text-sm text-foreground/70">Нэвтрэх (заавал биш)</p>
              <Button type="button" variant="secondary" size="sm" className="mt-1.5 rounded-xl" aria-label="Google-ээр нэвтрэх">
                Google-ээр үргэлжлүүлэх
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 lg:hidden">
            <Button
              type="submit"
              disabled={submitting || !userPhoneValid}
              size="lg"
              className="w-full rounded-2xl bg-primary hover:bg-primary/90"
            >
              {submitting ? "Боловсруулж байна…" : `${subtotal.toLocaleString()}₮ төлөх`}
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full rounded-2xl" asChild>
              <Link href="/cart">Сагс руу буцах</Link>
            </Button>
          </div>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-[360px] lg:shrink-0">
          <div className="lg:sticky lg:top-24 lg:space-y-4">
            {orderSummary}
            <div className="hidden flex-col gap-3 lg:flex">
              <Button
                type="submit"
                disabled={submitting || !userPhoneValid}
                size="lg"
                className="w-full rounded-2xl bg-primary hover:bg-primary/90"
              >
                {submitting ? "Боловсруулж байна…" : `${subtotal.toLocaleString()}₮ төлөх`}
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full rounded-2xl" asChild>
                <Link href="/cart">Сагс руу буцах</Link>
              </Button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
