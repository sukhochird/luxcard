"use client";

import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMerchantAuth } from "@/store/merchant-auth";
import { cn } from "@/lib/utils";

export function HeaderProfile() {
  const { user, logout } = useMerchantAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/merchant/login";
  };

  if (!user) return null;

  const initials = user.companyName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg px-2 py-2",
            "hover:bg-foreground/[0.06] data-[state=open]:bg-foreground/[0.06]"
          )}
          aria-label="Профайл цэс"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-xs font-semibold text-primary ring-1 ring-primary/10">
            {initials || "M"}
          </span>
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:block">
            {user.companyName}
          </span>
          <ChevronDown className="hidden size-4 shrink-0 text-foreground/45 sm:block" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 rounded-xl border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-0 shadow-lg"
        align="end"
        sideOffset={6}
      >
        <div className="border-b border-[var(--dashboard-border)] px-4 py-3">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.companyName}
          </p>
          <p className="mt-0.5 truncate text-xs text-foreground/55">{user.email}</p>
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/45">
            Merchant account
          </p>
        </div>
        <div className="p-1.5">
          <Link
            href="/merchant/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <User className="size-4 text-foreground/50" />
            Тойм
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="size-4 text-foreground/50" />
            Гарах
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
