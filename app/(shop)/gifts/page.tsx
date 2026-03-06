import { apiGet } from "@/lib/api/client";
import type { Gift, GiftsListResponse } from "@/lib/types";
import { GiftsSidebar } from "@/components/filters/GiftsSidebar";
import { GiftGrid } from "@/components/gift/GiftGrid";
import { GiftsBreadcrumb } from "@/components/gift/GiftsBreadcrumb";
import { GiftsPagination } from "@/components/gift/GiftsPagination";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const GIFTS_PER_PAGE = 12;

function buildGiftsQuery(
  searchParams: { [key: string]: string | string[] | undefined }
): string {
  const params = new URLSearchParams();
  const category = searchParams.category;
  if (category) {
    const arr = Array.isArray(category) ? category : [category];
    arr.forEach((c) => params.append("category", c));
  }
  const occasion = searchParams.occasion;
  if (occasion) {
    const arr = Array.isArray(occasion) ? occasion : [occasion];
    arr.forEach((o) => params.append("occasion", o));
  }
  const location = searchParams.location;
  if (location && location !== "All") params.set("location", String(location));
  const priceMin = searchParams.priceMin;
  if (priceMin) params.set("priceMin", String(priceMin));
  const priceMax = searchParams.priceMax;
  if (priceMax) params.set("priceMax", String(priceMax));
  const page = searchParams.page;
  if (page) params.set("page", Array.isArray(page) ? page[0] ?? "1" : page);
  params.set("limit", String(GIFTS_PER_PAGE));
  return `?${params.toString()}`;
}

function getActiveFilter(
  searchParams: { [key: string]: string | string[] | undefined }
): string | null {
  const category = searchParams.category;
  if (category) {
    const v = Array.isArray(category) ? category[0] : category;
    return v ?? null;
  }
  const occasion = searchParams.occasion;
  if (occasion) {
    const v = Array.isArray(occasion) ? occasion[0] : occasion;
    return v ?? null;
  }
  const location = searchParams.location;
  if (location && location !== "All") return String(location);
  return null;
}

export default async function GiftsListPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const query = buildGiftsQuery(resolved);
  const data = await apiGet<GiftsListResponse>(`/api/gifts${query}`);
  const activeFilter = getActiveFilter(resolved);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <GiftsBreadcrumb activeFilter={activeFilter} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
        Бэлгийн картууд
      </h1>
      <p className="mt-1 text-sm text-foreground/80 sm:text-base">
        Шүүж, Монгол дахь орон нутгийн бизнесээс сонгоно уу.
      </p>
      <div className="mt-6 flex gap-6 lg:gap-8">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-24">
            <GiftsSidebar />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="lg:hidden">
            <GiftsSidebar />
          </div>
          <div className="mt-4 lg:mt-0 space-y-6">
            <GiftGrid gifts={data.items} />
            <GiftsPagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              limit={data.limit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
