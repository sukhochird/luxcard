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
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Бэлгийн картууд
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Нийт {data.total} карт. Жагсаалт харах, засах.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
        {gifts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-foreground/5">
              <GiftIcon className="size-8 text-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground/70">
              Бэлгийн карт байхгүй байна
            </p>
            <p className="text-xs text-foreground/50">
              Карт нэмэхийг хүсвэл API эсвэл өгөгдлийн файлаар нэмнэ үү.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                  <th className="px-4 py-3 font-semibold text-foreground/80">
                    Карт
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground/80">
                    Ангилал
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground/80">
                    Үнэ (₮)
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground/80">
                    Төлөв
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground/80 text-right">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((gift: Gift) => (
                  <tr
                    key={gift.id}
                    className="border-b border-foreground/5 hover:bg-foreground/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-12 shrink-0 rounded-lg bg-foreground/10 bg-cover bg-center"
                          style={{ backgroundImage: `url(${gift.image})` }}
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {gift.title}
                          </p>
                          <p className="text-xs text-foreground/50">
                            {gift.merchant} • {gift.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{gift.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {Math.min(...gift.priceOptions).toLocaleString()} –{" "}
                      {Math.max(...gift.priceOptions).toLocaleString()}₮
                    </td>
                    <td className="px-4 py-3">
                      {gift.featured ? (
                        <Badge className="bg-primary/20 text-primary">
                          Онцлох
                        </Badge>
                      ) : (
                        <span className="text-foreground/50">Энгийн</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/merchant/dashboard/gifts/${gift.slug}`}
                            className="gap-1.5"
                          >
                            <Eye className="size-4" />
                            Харах
                          </Link>
                        </Button>
                        <Button variant="secondary" size="sm" asChild>
                          <Link
                            href={`/merchant/dashboard/gifts/${gift.slug}/edit`}
                            className="gap-1.5"
                          >
                            <Pencil className="size-4" />
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

      <div className="mt-4 flex items-center justify-between text-xs text-foreground/50">
        <span>
          Хуудас {data.page} / {data.totalPages}
        </span>
        <Link
          href="/gifts"
          className="text-primary hover:underline"
        >
          Дэлгүүрийн жагсаалт →
        </Link>
      </div>
    </div>
  );
}
