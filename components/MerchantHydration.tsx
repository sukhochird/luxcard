"use client";

import { useEffect } from "react";
import { useMerchantAuthStore } from "@/store/merchant-auth";

export function MerchantHydration() {
  const hydrate = useMerchantAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
