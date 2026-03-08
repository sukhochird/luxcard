"use client";

import dynamic from "next/dynamic";

const SearchBar = dynamic(
  () => import("@/components/search/SearchBar").then((m) => ({ default: m.SearchBar })),
  { ssr: false }
);

export function MobileSearchStrip() {
  return (
    <div className="md:hidden bg-background/95 backdrop-blur-sm px-3 py-2.5">
      <div className="mx-auto max-w-7xl w-full">
        <SearchBar />
      </div>
    </div>
  );
}
