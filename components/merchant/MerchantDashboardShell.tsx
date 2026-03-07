"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderNotifications } from "@/components/merchant/HeaderNotifications";
import { HeaderProfile } from "@/components/merchant/HeaderProfile";
import { useMerchantAuth } from "@/store/merchant-auth";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { href: "/merchant/dashboard", label: "Тойм", icon: LayoutDashboard },
  { href: "/merchant/dashboard/gifts", label: "Бэлгийн картууд", icon: Gift },
  { href: "#", label: "Захиалга", icon: ShoppingBag },
  { href: "#", label: "Тохиргоо", icon: Settings },
];

export function MerchantDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useMerchantAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/merchant/login";
  };

  return (
    <div className="flex min-h-screen flex-col bg-foreground/[0.03]">
      {/* Full-width header — horizontal line runs edge to edge */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-foreground/10 bg-background px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Цэс нээх"
        >
          <Menu className="size-5" />
        </Button>
        <Link
          href="/merchant/dashboard"
          className="flex items-center gap-2.5 font-semibold text-foreground transition-opacity hover:opacity-90 shrink-0"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            L
          </span>
          <span className="text-base">LuxCard</span>
          <span className="hidden text-xs font-normal text-foreground/50 sm:inline">
            Merchant
          </span>
        </Link>
        <div className="min-w-0 flex-1" />
        <HeaderNotifications />
        <HeaderProfile />
        <Link
          href="/"
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          Нүүр хуудас →
        </Link>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Sidebar overlay (mobile) */}
        <div
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
          style={{
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? "auto" : "none",
            transition: "opacity 0.2s",
          }}
        />

        {/* Sidebar — below header on desktop so its right border meets the header bottom line */}
        <aside
          className={cn(
            "fixed left-0 z-50 flex w-64 flex-col border-r border-foreground/10 bg-background transition-transform duration-200 ease-out",
            "top-14 bottom-0 lg:bg-foreground/[0.02]",
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full shadow-xl lg:translate-x-0 lg:shadow-none"
          )}
        >
          <div className="flex shrink-0 justify-end border-b border-foreground/10 p-2 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => setSidebarOpen(false)}
              aria-label="Цэс хаах"
            >
              <X className="size-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3 lg:p-4" aria-label="Үндсэн цэс">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
              Цэс
            </p>
            {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = href !== "#" && pathname === href;
              const isExternal = href === "#";
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
                    isExternal && "pointer-events-none opacity-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      isActive ? "bg-primary/20 text-primary" : "bg-foreground/5 text-foreground/60"
                    )}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {isExternal && (
                    <span className="shrink-0 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
                      Удахгүй
                    </span>
                  )}
                  {!isExternal && !isActive && (
                    <ChevronRight className="size-4 shrink-0 text-foreground/30" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 border-t border-foreground/10 p-3 lg:p-4">
            <div className="mb-2 truncate rounded-lg bg-foreground/[0.04] px-3 py-2.5 text-xs font-medium text-foreground/70">
              {user?.companyName}
            </div>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl text-foreground/70 hover:bg-red-500/10 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="size-4.5 shrink-0" />
              <span>Гарах</span>
            </Button>
          </div>
        </aside>

        {/* Main content — offset by sidebar width on desktop */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <main className="min-h-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
