"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SearchHit } from "@/lib/search/types";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface SearchResultsProps {
  hits: SearchHit[];
  query: string;
  isOpen: boolean;
  highlightedIndex: number;
  onClose: () => void;
  onHighlight: (index: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function SearchResults({
  hits,
  query,
  isOpen,
  highlightedIndex,
  onClose,
  onHighlight,
  inputRef,
}: SearchResultsProps) {
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current;
    if (el && highlightedIndex >= 0) {
      const item = el.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  function handleSelect(slug: string) {
    onClose();
    router.push(`/gifts/${slug}`);
  }

  if (!isOpen || !query.trim()) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(70vh,400px)] overflow-auto rounded-2xl border border-foreground/10 bg-background shadow-xl"
      role="listbox"
      id="search-results-listbox"
      aria-label="Хайлтын үр дүн"
    >
      {hits.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-foreground/70">
          No results found
        </div>
      ) : (
        <ul ref={listRef} className="py-2">
          {hits.map((hit, i) => {
            const minPrice =
              hit.priceOptions?.length > 0
                ? Math.min(...hit.priceOptions)
                : null;
            return (
              <li
                key={hit.id}
                id={`search-result-${hit.id}`}
                role="option"
                aria-selected={i === highlightedIndex}
                tabIndex={-1}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors",
                  i === highlightedIndex
                    ? "bg-primary/10"
                    : "hover:bg-foreground/5"
                )}
                onMouseEnter={() => onHighlight(i)}
                onClick={() => handleSelect(hit.slug)}
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-foreground/10">
                  <Image
                    src={failedIds.has(hit.id) ? PLACEHOLDER_IMAGE : (hit.image || PLACEHOLDER_IMAGE)}
                    alt={hit.title ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, 48px"
                    loading="lazy"
                    onError={() =>
                      setFailedIds((prev) => new Set(prev).add(hit.id))
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {hit.title}
                  </p>
                  <p className="truncate text-sm text-foreground/70">
                    {hit.merchant}
                  </p>
                  <p className="text-xs text-foreground/50">{hit.location}</p>
                </div>
                {minPrice !== null && (
                  <span className="shrink-0 text-sm font-medium text-foreground">
                    From {minPrice.toLocaleString()}₮
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
