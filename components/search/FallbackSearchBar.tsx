"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiGet } from "@/lib/api/client";
import type { Gift } from "@/lib/types";
import type { SearchHit } from "@/lib/search/types";
import { SearchResults } from "./SearchResults";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

function giftToHit(g: Gift): SearchHit {
  return {
    id: g.id,
    title: g.title,
    slug: g.slug,
    merchant: g.merchant,
    category: g.category,
    occasion: g.occasion,
    location: g.location,
    priceOptions: g.priceOptions,
    image: g.image,
    description: g.description,
  };
}

function filterGifts(gifts: Gift[], q: string): Gift[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return [];
  return gifts.filter(
    (g) =>
      g.title.toLowerCase().includes(lower) ||
      g.merchant.toLowerCase().includes(lower) ||
      g.category.toLowerCase().includes(lower) ||
      g.location.toLowerCase().includes(lower) ||
      g.occasion.some((o) => o.toLowerCase().includes(lower))
  );
}

export function FallbackSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [allGifts, setAllGifts] = useState<Gift[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiGet<{ items: Gift[] }>("/api/gifts?limit=500")
      .then((data) => {
        setAllGifts(data.items);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!loaded || !debouncedQuery.trim()) {
      setHits([]);
      return;
    }
    const filtered = filterGifts(allGifts, debouncedQuery);
    setHits(filtered.slice(0, 6).map(giftToHit));
  }, [allGifts, debouncedQuery, loaded]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        inputRef.current?.blur();
        return;
      }
      if (!isOpen || hits.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => (i < hits.length - 1 ? i + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => (i > 0 ? i - 1 : hits.length - 1));
        return;
      }
      if (e.key === "Enter" && highlightedIndex >= 0 && hits[highlightedIndex]) {
        e.preventDefault();
        router.push(`/gifts/${hits[highlightedIndex].slug}`);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, hits, highlightedIndex, close, router]);

  const displayHits = hits.slice(0, 6);
  const showDropdown = query.trim().length > 0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-md flex-1 md:max-w-sm lg:max-w-md"
    >
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/50"
          aria-hidden
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Бэлэг, худалдаа эрхлэгч хайх..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          aria-label="Бэлгийн карт хайх"
          aria-expanded={isOpen}
          aria-controls="search-results-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 && displayHits[highlightedIndex]
              ? `search-result-${displayHits[highlightedIndex].id}`
              : undefined
          }
          className={cn(
            "w-full rounded-full border-foreground/20 py-2 pl-11 pr-4",
            "focus-visible:ring-2 focus-visible:ring-primary"
          )}
        />
      </div>
      {showDropdown && (
        <SearchResults
          hits={displayHits}
          query={query}
          isOpen={isOpen}
          highlightedIndex={highlightedIndex}
          onClose={close}
          onHighlight={setHighlightedIndex}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}
