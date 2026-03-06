"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GiftsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

const MAX_VISIBLE = 5;

function buildPageUrl(searchParams: URLSearchParams, page: number): string {
  const next = new URLSearchParams(searchParams.toString());
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const q = next.toString();
  return q ? `/gifts?${q}` : "/gifts";
}

export function GiftsPagination({
  page,
  totalPages,
  total,
  limit,
}: GiftsPaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1 || total <= 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pageNumbers: number[] = [];
  let left = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
  let right = Math.min(totalPages, left + MAX_VISIBLE - 1);
  if (right - left + 1 < MAX_VISIBLE) {
    left = Math.max(1, right - MAX_VISIBLE + 1);
  }
  for (let i = left; i <= right; i++) pageNumbers.push(i);

  return (
    <nav
      className="flex flex-col items-center gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:justify-between"
      aria-label="Хуудаслалт"
    >
      <p className="text-sm text-foreground/70">
        {start}–{end} / {total.toLocaleString()} бүтээгдэхүүн
      </p>
      <div className="flex items-center gap-1">
        {page <= 1 ? (
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Өмнөх хуудас"
            disabled
          >
            <ChevronLeft className="size-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Өмнөх хуудас"
            asChild
          >
            <Link href={buildPageUrl(searchParams, page - 1)} prefetch={false}>
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        )}
        <div className="flex items-center gap-0.5">
          {left > 1 && (
            <>
              <Button variant="ghost" size="icon" className="size-9" asChild>
                <Link href={buildPageUrl(searchParams, 1)} prefetch={false}>
                  1
                </Link>
              </Button>
              {left > 2 && (
                <span className="px-1 text-foreground/50" aria-hidden>
                  …
                </span>
              )}
            </>
          )}
          {pageNumbers.map((n) => (
            <Button
              key={n}
              variant={n === page ? "primary" : "ghost"}
              size="icon"
              className={cn("size-9 shrink-0", n === page && "pointer-events-none")}
              aria-label={n === page ? `Хуудас ${n}, одоогийн` : `Хуудас ${n}`}
              aria-current={n === page ? "page" : undefined}
              asChild
            >
              <Link
                href={buildPageUrl(searchParams, n)}
                prefetch={n === page ? false : undefined}
              >
                {n}
              </Link>
            </Button>
          ))}
          {right < totalPages && (
            <>
              {right < totalPages - 1 && (
                <span className="px-1 text-foreground/50" aria-hidden>
                  …
                </span>
              )}
              <Button variant="ghost" size="icon" className="size-9" asChild>
                <Link
                  href={buildPageUrl(searchParams, totalPages)}
                  prefetch={false}
                >
                  {totalPages}
                </Link>
              </Button>
            </>
          )}
        </div>
        {page >= totalPages ? (
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Дараагийн хуудас"
            disabled
          >
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Дараагийн хуудас"
            asChild
          >
            <Link
              href={buildPageUrl(searchParams, page + 1)}
              prefetch={false}
            >
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
