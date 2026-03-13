"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMerchantAuth } from "@/store/merchant-auth";
import { MerchantDashboardShell } from "./MerchantDashboardShell";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, hydrate } = useMerchantAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/merchant/login");
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dashboard-sidebar)]">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <MerchantDashboardShell>{children}</MerchantDashboardShell>;
}
