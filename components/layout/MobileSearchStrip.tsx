"use client";

import dynamic from "next/dynamic";

const SearchBar = dynamic(
  () => import("@/components/search/SearchBar").then((m) => ({ default: m.SearchBar })),
  { ssr: false }
);

export function MobileSearchStrip() {
  return (
    <div className="md:hidden border-b border-foreground/10 bg-background px-4 py-3">
      <div className="mx-auto max-w-7xl w-full">
        <SearchBar />
      </div>
    </div>
  );
}
