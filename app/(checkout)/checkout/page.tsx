"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Gift, Clock, CreditCard, ShoppingBag, Calendar } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPackagingModifier } from "@/app/(shop)/gifts/[slug]/PackagingSelection";
import type { PackagingId } from "@/lib/types";
import { DELIVERY_FEE } from "@/lib/constants";
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
  const [giftDeliveryAddress, setGiftDeliveryAddress] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userPhoneValid = PHONE_REGEX.test(userPhone.replace(/\s/g, ""));
  const userPhoneError =
    userPhoneTouched && userPhone.length > 0 && !userPhoneValid;

  const { subtotal, deliveryFee, total } = useMemo(() => {
    let sub = 0;
    for (const item of items) {
      const packMod = getPackagingModifier(item.packaging as PackagingId);
      const unit = Math.round(
        item.amount * (1 - (item.discountPercent ?? 0) / 100)
      );
      sub += (unit + packMod) * item.quantity;
    }
    const needsDelivery =
      deliveryType === "self" ||
      (deliveryType === "gift" && giftDeliveryAddress.trim().length > 0);
    const fee = needsDelivery ? DELIVERY_FEE : 0;
    return { subtotal: sub, deliveryFee: fee, total: sub + fee };
  }, [items, deliveryType, giftDeliveryAddress]);

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
    <section aria-labelledby="summary-heading" className="rounded-2xl border border-foreground/10 bg-background shadow-lg">
      <div className="flex items-center gap-3 border-b border-foreground/10 px-6 py-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden>
          <ShoppingBag className="size-5" />
        </span>
        <div>
          <h2 id="summary-heading" className="text-xl font-bold text-foreground">
            Захиалгын тойм
          </h2>
          <p className="mt-0.5 text-sm text-foreground/60">{items.length} бараа</p>
        </div>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {items.map((item) => {
            const packMod = getPackagingModifier(item.packaging as PackagingId);
            const unit = Math.round(
              item.amount * (1 - (item.discountPercent ?? 0) / 100)
            );
            const lineTotal = (unit + packMod) * item.quantity;
            return (
              <li
                key={`${item.slug}-${item.amount}-${item.packaging}`}
                className="flex gap-4"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-foreground/70">{item.merchant}</p>
                  <p className="mt-0.5 text-sm tabular-nums text-foreground/70">
                    ×{item.quantity} · {lineTotal.toLocaleString()}₮
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 space-y-2 border-t border-foreground/10 pt-5 text-sm">
          <div className="flex justify-between text-foreground/80">
            <span>Дэд дүн</span>
            <span className="tabular-nums">{subtotal.toLocaleString()}₮</span>
          </div>
          <div className="flex justify-between text-foreground/80">
            <span>Хүргэлтийн төлбөр</span>
            <span className="tabular-nums">{deliveryFee > 0 ? `${deliveryFee.toLocaleString()}₮` : "—"}</span>
          </div>
          {deliveryFee === 0 && (
            <p className="text-xs text-foreground/55">Хаяг оруулахгүй бол хүргэлт нэмэгдэхгүй</p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-foreground/[0.06] px-4 py-4">
          <span className="text-base font-bold text-foreground">Нийт</span>
          <span className="text-2xl font-bold tabular-nums text-foreground">{total.toLocaleString()}₮</span>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Сагс руу буцах
        </Link>
        <header className="mt-6 sm:mt-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Төлбөр төлөх
          </h1>
          <p className="mt-1.5 text-sm text-foreground/70">
            Хаяг болон хүлээн авагчийн мэдээллээ оруулна уу.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 lg:flex lg:items-start lg:gap-14">
          <div className="min-w-0 flex-1 lg:max-w-xl">
            <section aria-labelledby="delivery-heading" className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-lg sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden>
                  <Clock className="size-6" />
                </span>
                <div className="min-w-0">
                  <h2 id="delivery-heading" className="text-xl font-bold text-foreground">
                    Хүргэлт ба илгээлт
                  </h2>
                  <p className="mt-1.5 text-sm text-foreground/70">
                    Хүргэлтийн төлбөр {DELIVERY_FEE.toLocaleString()}₮ · 24 цагийн дотор
                  </p>
                </div>
              </div>

              {/* Mode: segmented pill toggle */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/60">Хэрэглэх зориулалт</p>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-foreground/[0.06] p-1.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("self")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all",
                      deliveryType === "self"
                        ? "bg-background text-primary shadow-sm ring-1 ring-primary/20"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <User className="size-4 shrink-0" aria-hidden />
                    Өөртөө ашиглах
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("gift")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all",
                      deliveryType === "gift"
                        ? "bg-background text-primary shadow-sm ring-1 ring-primary/20"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <Gift className="size-4 shrink-0" aria-hidden />
                    Бэлэг болгон илгээх
                  </button>
                </div>
              </div>

              {deliveryType === "self" && (
                <div className="mt-6 space-y-1">
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-foreground">
                    Хүргэлтийн хаяг <span className="text-red-600">*</span>
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
                <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50/80 p-5 dark:border-amber-800/50 dark:bg-amber-950/20">
                  <div className="mb-4 flex items-center gap-2">
                    <Gift className="size-5 text-amber-600 dark:text-amber-500" aria-hidden />
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      Бэлэг илгээх
                    </span>
                  </div>
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label htmlFor="recipientName" className="block text-sm font-medium text-foreground">
                          Хүлээн авагчийн нэр <span className="text-red-600">*</span>
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
                      <div className="space-y-1">
                        <label htmlFor="recipientPhone" className="block text-sm font-medium text-foreground">
                          Утас <span className="text-red-600">*</span>
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
                    <div className="space-y-1">
                      <label htmlFor="giftDeliveryAddress" className="block text-sm font-medium text-foreground">
                        Хүргэх хаяг <span className="font-normal text-foreground/70">(заавал биш)</span>
                      </label>
                      <Input
                        id="giftDeliveryAddress"
                        type="text"
                        value={giftDeliveryAddress}
                        onChange={(e) => setGiftDeliveryAddress(e.target.value)}
                        placeholder="Гудамж, дүүрэг, хот"
                        className="mt-2"
                      />
                    </div>

                    {/* Time: card-style options */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-foreground">Илгээх цаг</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSendOption("now")}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                            sendOption === "now"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-foreground/10 bg-foreground/[0.06] text-foreground/70 hover:border-primary/50"
                          )}
                        >
                          <Clock className="size-5 shrink-0" aria-hidden />
                          <span className="text-sm font-medium">Одоо илгээх</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSendOption("scheduled")}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                            sendOption === "scheduled"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-foreground/10 bg-foreground/[0.06] text-foreground/70 hover:border-primary/50"
                          )}
                        >
                          <Calendar className="size-5 shrink-0" aria-hidden />
                          <span className="text-sm font-medium">Товолсон цагт</span>
                        </button>
                      </div>
                      {sendOption === "scheduled" && (
                        <div className="mt-3">
                          <label htmlFor="scheduledAt" className="block text-sm font-medium text-foreground/80 mb-1.5">
                            Огноо, цаг
                          </label>
                          <Input
                            id="scheduledAt"
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full max-w-xs"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="giftMessage" className="block text-sm font-medium text-foreground">
                        Хүлээн авагчид зориулсан захиа <span className="font-normal text-foreground/70">(заавал биш)</span>
                      </label>
                      <textarea
                        id="giftMessage"
                        rows={3}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Тухайн хүндээ хэлмээр зүйлээ энд бичнэ үү"
                        className={cn(
                          "mt-2 w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-sm transition-colors",
                          "placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        )}
                      />
                    </div>

                    {/* Custom visible checkbox */}
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-colors",
                        sendAnonymously ? "border-primary bg-primary/10" : "border-foreground/10 bg-foreground/[0.04] hover:border-primary/30"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={sendAnonymously}
                        onChange={(e) => setSendAnonymously(e.target.checked)}
                        className="sr-only"
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                          sendAnonymously ? "border-primary bg-primary text-white" : "border-foreground/30 bg-background"
                        )}
                      >
                        {sendAnonymously && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white" aria-hidden>
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-foreground">
                        Нэрээ болон мэдээллээ нууцалж илгээх — хүлээн авагч таны нэр, утас харахгүй
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Sender section with divider */}
              <div className="relative mt-10 pt-10">
                <div className="absolute inset-x-0 top-0 flex items-center">
                  <div className="w-full border-t-2 border-foreground/10" />
                </div>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-background px-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                    Таны мэдээлэл
                  </span>
                </div>
                <div className="space-y-1 pt-3">
                  <label htmlFor="userPhone" className="block text-sm font-medium text-foreground">
                    Таны утас <span className="text-red-600">*</span>
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
                  <p className="mt-4 text-sm text-foreground/70">Нэвтрэх (заавал биш)</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2 rounded-xl" aria-label="Google-ээр нэвтрэх">
                    Google-ээр үргэлжлүүлэх
                  </Button>
                </div>
              </div>
            </section>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-200" role="alert">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 lg:hidden">
            <Button
              type="submit"
              disabled={submitting || !userPhoneValid}
              size="lg"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-6 text-base font-semibold hover:bg-primary/90 disabled:opacity-60"
              style={{ backgroundColor: "#0052FF" }}
            >
              <CreditCard className="size-5 shrink-0" aria-hidden />
              {submitting ? "Боловсруулж байна…" : `${total.toLocaleString()}₮ төлөх`}
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full rounded-xl" asChild>
              <Link href="/cart" className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" aria-hidden />
                Сагс руу буцах
              </Link>
            </Button>
          </div>
        </div>

        <aside className="mt-10 lg:sticky lg:top-8 lg:mt-0 lg:w-[400px] lg:shrink-0">
          <div className="space-y-6">
            {orderSummary}
            <div className="hidden flex-col gap-3 lg:flex">
              <Button
                type="submit"
                disabled={submitting || !userPhoneValid}
                size="lg"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-6 text-base font-semibold disabled:opacity-60"
                style={{ backgroundColor: "#0052FF" }}
              >
                <CreditCard className="size-5 shrink-0" aria-hidden />
                {submitting ? "Боловсруулж байна…" : `${total.toLocaleString()}₮ төлөх`}
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full rounded-xl" asChild>
                <Link href="/cart" className="inline-flex items-center gap-2">
                  <ArrowLeft className="size-4" aria-hidden />
                  Сагс руу буцах
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </form>
      </div>
    </div>
  );
}
