"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
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
          className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5"
          aria-label="Профайл цэс"
        >
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-xs font-semibold",
              "bg-primary/15 text-primary"
            )}
          >
            {initials || "M"}
          </span>
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground sm:block">
            {user.companyName}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end" sideOffset={8}>
        <div className="px-2 py-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.companyName}
          </p>
          <p className="truncate text-xs text-foreground/50">{user.email}</p>
        </div>
        <div className="border-t border-foreground/10" />
        <div className="p-1">
          <Link
            href="/merchant/dashboard"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
          >
            <User className="size-4" />
            Тойм
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Гарах
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
