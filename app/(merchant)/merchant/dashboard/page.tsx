"use client";

import Link from "next/link";
import {
  Gift,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  Sparkles,
  Clock,
  BarChart3,
} from "lucide-react";
import { useMerchantAuth } from "@/store/merchant-auth";
import { cn } from "@/lib/utils";

/** Сүүлийн 7 өдрийн борлуулалт (мянган ₮) */
const MOCK_SALES_CHART = [
  { label: "Даваа", value: 180 },
  { label: "Мягмар", value: 240 },
  { label: "Лхагва", value: 190 },
  { label: "Пүрэв", value: 310 },
  { label: "Баасан", value: 280 },
  { label: "Бямба", value: 420 },
  { label: "Ням", value: 350 },
];

const MOCK_STATS = [
  {
    label: "Өнөөдрийн захиалга",
    value: "12",
    sub: "Өнгөрсөн өдрөөс +2",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    label: "Энэ сарын орлого",
    value: "1,240,000",
    suffix: "₮",
    sub: "Өмнөх сараас +8%",
    trend: "up",
    icon: TrendingUp,
    highlight: true,
  },
  {
    label: "Идэвхтэй картууд",
    value: "3",
    sub: "Нийт борлуулалттай",
    icon: Gift,
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Өглөөний мэнд";
  if (h < 18) return "Сайн өдөр";
  return "Оройн мэнд";
}

export default function MerchantDashboardPage() {
  const { user } = useMerchantAuth();
  const greeting = getGreeting();

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Тойм
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Үзүүлэлт, борлуулалт, түргэн үйлдлүүд
        </p>
      </div>

      {/* Welcome card — primary focus */}
      <div className="rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/55">{greeting}</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {user?.companyName}
            </h2>
            <p className="mt-2 max-w-md text-sm text-foreground/65">
              Таны бэлгийн карт болон захиалгын тойм. Өнөөдрийн үзүүлэлтүүд доор.
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Идэвхтэй
            </span>
          </div>
        </div>
      </div>

      {/* Stats — clear metric cards */}
      <section className="mt-8" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-sm font-semibold text-foreground/80">
          Үзүүлэлт
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_STATS.map(({ label, value, suffix = "", sub, trend, icon: Icon, highlight }) => (
            <div
              key={label}
              className={cn(
                "rounded-xl border bg-[var(--dashboard-surface)] p-5 shadow-sm transition-shadow hover:shadow-md",
                highlight
                  ? "border-primary/25 bg-primary/[0.04]"
                  : "border-[var(--dashboard-border)]"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground/55">
                    {label}
                  </p>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        "text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl",
                        highlight && "text-primary"
                      )}
                    >
                      {value}
                    </span>
                    {suffix && (
                      <span className={cn(
                        "text-base font-semibold",
                        highlight ? "text-primary" : "text-foreground/75"
                      )}>
                        {suffix}
                      </span>
                    )}
                  </p>
                  {sub && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-foreground/50">
                      {trend === "up" && (
                        <span className="font-medium text-green-600 dark:text-green-400">↑</span>
                      )}
                      {sub}
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg",
                    highlight ? "bg-primary/15 text-primary" : "bg-foreground/[0.06] text-foreground/65"
                  )}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sales chart */}
      <section className="mt-10" aria-labelledby="chart-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="chart-heading" className="text-sm font-semibold text-foreground/80">
              Борлуулалтын график
            </h2>
            <p className="mt-0.5 text-xs text-foreground/55">
              Сүүлийн 7 өдрийн орлого (мянган ₮)
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <BarChart3 className="size-3.5" />
            Өдрийн тойм
          </span>
        </div>
        <div className="mt-4 rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm sm:p-6">
          <div className="flex h-52 items-end justify-between gap-2 sm:gap-3">
            {MOCK_SALES_CHART.map(({ label, value }) => {
              const max = Math.max(...MOCK_SALES_CHART.map((d) => d.value));
              const heightPercent = max > 0 ? (value / max) * 100 : 0;
              return (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full flex-col items-center justify-end">
                    <span className="mb-1 text-xs font-medium tabular-nums text-foreground/65">
                      {value}
                    </span>
                    <div
                      className="w-full max-w-[2.75rem] rounded-t-md bg-primary/25 transition-all duration-300 hover:bg-primary/35"
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                      title={`${label}: ${value}к₮`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-foreground/50">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--dashboard-border)] pt-4">
            <p className="text-xs text-foreground/50">
              Нийт:{" "}
              <span className="font-semibold text-foreground">
                {MOCK_SALES_CHART.reduce((a, d) => a + d.value, 0).toLocaleString()}к₮
              </span>
            </p>
            <p className="text-xs text-foreground/50">
              Дундаж:{" "}
              <span className="font-semibold text-foreground">
                {Math.round(
                  MOCK_SALES_CHART.reduce((a, d) => a + d.value, 0) /
                    MOCK_SALES_CHART.length
                ).toLocaleString()}
                к₮/өдөр
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-10" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-sm font-semibold text-foreground/80">
          Түргэн үйлдлүүд
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/merchant/dashboard/gifts"
            className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-primary/[0.04] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Gift className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">
                  Бэлгийн карт удирдах
                </p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  Карт нэмэх, засах, үнийг тохируулах
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
          <div
            className="flex cursor-not-allowed items-center justify-between gap-4 rounded-xl border border-dashed border-[var(--dashboard-border)] bg-foreground/[0.02] p-5 opacity-60"
            aria-disabled
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground/40">
                <CreditCard className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground/70">
                  Захиалга удирдах
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground/50">
                  <Clock className="size-3.5" />
                  Удахгүй нээгдэнэ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent placeholder */}
      <div className="mt-10 rounded-xl border border-dashed border-[var(--dashboard-border)] bg-foreground/[0.02] py-10 text-center">
        <p className="text-sm font-medium text-foreground/55">
          Сүүлийн захиалга, орлогын дэлгэрэнгүй энд харагдана
        </p>
        <p className="mt-1 text-xs text-foreground/45">
          Захиалга удирдах идэвхжсэн үед энэ хэсэг дүүрнэ
        </p>
      </div>
    </div>
  );
}
