import Link from "next/link";
import { Eye, Pencil, Gift as GiftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Gift, GiftsListResponse } from "@/lib/types";
import { apiGet } from "@/lib/api/client";

export const metadata = {
  title: "Бэлгийн карт удирдах",
  description: "Бэлгийн картуудын жагсаалт, засах.",
};

export default async function MerchantGiftsListPage() {
  const data = await apiGet<GiftsListResponse>("/api/gifts?limit=100");
  const gifts = data.items;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Бэлгийн картууд
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Нийт {data.total} карт · Жагсаалт харах, засах
        </p>
      </div>

      <div className="rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] shadow-sm overflow-hidden">
        {gifts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-6">
            <div className="flex size-16 items-center justify-center rounded-xl bg-foreground/[0.06]">
              <GiftIcon className="size-8 text-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground/70">
              Бэлгийн карт байхгүй байна
            </p>
            <p className="text-xs text-foreground/50 text-center max-w-sm">
              Карт нэмэхийг хүсвэл API эсвэл өгөгдлийн файлаар нэмнэ үү.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--dashboard-border)] bg-foreground/[0.03]">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground/65">
                    Карт
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground/65">
                    Ангилал
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground/65">
                    Үнэ (₮)
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground/65">
                    Төлөв
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-foreground/65">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dashboard-border)]">
                {gifts.map((gift: Gift) => (
                  <tr
                    key={gift.id}
                    className="transition-colors hover:bg-foreground/[0.02]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-11 shrink-0 rounded-lg border border-[var(--dashboard-border)] bg-foreground/5 bg-cover bg-center"
                          style={{ backgroundImage: `url(${gift.image})` }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {gift.title}
                          </p>
                          <p className="text-xs text-foreground/55 truncate">
                            {gift.merchant} · {gift.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="secondary" className="font-medium">
                        {gift.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-foreground/80">
                      {Math.min(...gift.priceOptions).toLocaleString()} –{" "}
                      {Math.max(...gift.priceOptions).toLocaleString()}₮
                    </td>
                    <td className="px-5 py-3.5">
                      {gift.featured ? (
                        <Badge className="bg-primary/15 text-primary border-0">
                          Онцлох
                        </Badge>
                      ) : (
                        <span className="text-xs text-foreground/50">Энгийн</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="sm" asChild className="h-8">
                          <Link
                            href={`/merchant/dashboard/gifts/${gift.slug}`}
                            className="gap-1.5"
                          >
                            <Eye className="size-3.5" />
                            Харах
                          </Link>
                        </Button>
                        <Button variant="secondary" size="sm" asChild className="h-8">
                          <Link
                            href={`/merchant/dashboard/gifts/${gift.slug}/edit`}
                            className="gap-1.5"
                          >
                            <Pencil className="size-3.5" />
                            Засах
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-foreground/55">
        <span>
          Хуудас {data.page} / {data.totalPages}
        </span>
        <Link
          href="/gifts"
          className="font-medium text-primary hover:underline"
        >
          Дэлгүүрийн жагсаалт →
        </Link>
      </div>
    </div>
  );
}
