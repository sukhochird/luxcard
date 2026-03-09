"use client";

import { useEffect, useState } from "react";
import type { GiftCategory, OccasionOption } from "@/lib/types";

export function useCategories(): {
  categories: GiftCategory[];
  loading: boolean;
  error: Error | null;
} {
  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: { categories: GiftCategory[] }) => {
        if (!cancelled) setCategories(data.categories ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}

export function useOccasions(): {
  occasions: OccasionOption[];
  loading: boolean;
  error: Error | null;
} {
  const [occasions, setOccasions] = useState<OccasionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/occasions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch occasions");
        return res.json();
      })
      .then((data: { occasions: OccasionOption[] }) => {
        if (!cancelled) setOccasions(data.occasions ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { occasions, loading, error };
}

/** Fetches both categories and occasions in parallel. */
export function useFilterOptions(): {
  categories: GiftCategory[];
  occasions: OccasionOption[];
  loading: boolean;
  error: Error | null;
} {
  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [occasions, setOccasions] = useState<OccasionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/occasions").then((r) => r.json()),
    ])
      .then(([catRes, occRes]) => {
        if (cancelled) return;
        setCategories(catRes.categories ?? []);
        setOccasions(occRes.occasions ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, occasions, loading, error };
}
