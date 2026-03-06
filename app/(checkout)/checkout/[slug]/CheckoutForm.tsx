"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/api/client";
import type { CheckoutResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  slug: string;
  amount: number;
  merchant: string;
}

export function CheckoutForm({ slug, amount, merchant }: CheckoutFormProps) {
  const router = useRouter();
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendOption, setSendOption] = useState<"now" | "scheduled">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notifyRecipientBySms, setNotifyRecipientBySms] = useState(false);
  const [receiverPhone, setReceiverPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendOption === "scheduled" && !scheduledAt.trim()) {
      setError("Илгээх цаг сонгоно уу.");
      return;
    }
    if (notifyRecipientBySms && !receiverPhone.trim()) {
      setError("SMS мэдэгдэл илгээх бол хүлээн авагчийн утасны дугаар оруулна уу.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiPost<CheckoutResponse>("/api/checkout", {
        slug,
        amount,
        senderName: senderName.trim(),
        receiverName: receiverName.trim(),
        receiverEmail: receiverEmail.trim(),
        message: message.trim(),
        sendOption,
        ...(sendOption === "scheduled" && scheduledAt.trim() && { scheduledAt: new Date(scheduledAt).toISOString() }),
        notifyRecipientBySms: notifyRecipientBySms || undefined,
        ...(notifyRecipientBySms && receiverPhone.trim() && { receiverPhone: receiverPhone.trim().replace(/\s/g, "") }),
      });
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(res.orderId)}&redeemCode=${encodeURIComponent(res.redeemCode)}`
      );
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm sm:p-6">
        <div>
          <label htmlFor="senderName" className="block text-sm font-medium text-foreground">
            Таны нэр <span className="text-red-500">*</span>
          </label>
          <Input
            id="senderName"
            type="text"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="receiverName" className="block text-sm font-medium text-foreground">
              Хүлээн авагчийн нэр <span className="text-red-500">*</span>
            </label>
            <Input
              id="receiverName"
              type="text"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="receiverEmail" className="block text-sm font-medium text-foreground">
              Имэйл <span className="text-red-500">*</span>
            </label>
            <Input
              id="receiverEmail"
              type="email"
              required
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
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
        <div className="mt-4">
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            Мэндчилгээ (заавал биш)
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Хүлээн авагчид зориулсан мэндчилгээ"
            className={cn(
              "mt-2 w-full rounded-2xl border border-foreground/20 bg-background px-4 py-3 text-foreground shadow-sm transition-colors",
              "placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          />
        </div>
        <div className="mt-4 border-t border-foreground/10 pt-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={notifyRecipientBySms}
              onChange={(e) => setNotifyRecipientBySms(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-foreground/30 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              Захиалга баталгаажсаны дараа хүлээн авагчид SMS илгээх
            </span>
          </label>
          {notifyRecipientBySms && (
            <div className="ml-7 mt-3">
              <label htmlFor="receiverPhone" className="block text-sm font-medium text-foreground">
                Хүлээн авагчийн утас <span className="text-red-500">*</span>
              </label>
              <Input
                id="receiverPhone"
                type="tel"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="8 орон"
                className="mt-2 max-w-xs"
              />
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400" role="alert">
          {error}
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="rounded-2xl bg-primary hover:bg-primary/90 sm:min-w-[180px]"
        >
          {submitting ? "Боловсруулж байна…" : `${amount.toLocaleString()}₮ захиалах`}
        </Button>
        <Button type="button" variant="outline" size="lg" className="rounded-2xl" asChild>
          <Link href="/gifts">Цуцлах</Link>
        </Button>
      </div>
    </form>
  );
}
