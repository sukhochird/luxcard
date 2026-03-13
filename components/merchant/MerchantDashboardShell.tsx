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
    <div className="flex min-h-screen flex-col bg-[var(--dashboard-sidebar)]">
      {/* Header — glass effect app bar */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-white/20 bg-white/70 px-4 backdrop-blur-md dark:border-white/10 dark:bg-foreground/80 sm:gap-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Цэс нээх"
        >
          <Menu className="size-5 text-foreground/70" />
        </Button>
        <Link
          href="/merchant/dashboard"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm ring-1 ring-black/5">
            L
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-foreground sm:block">
            LuxCard
          </span>
          <span className="hidden h-5 w-px bg-foreground/15 sm:block" aria-hidden />
          <span className="hidden rounded-md bg-foreground/[0.06] px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground/60 sm:inline-block">
            Merchant
          </span>
        </Link>
        <div className="min-w-0 flex-1" />
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Хэрэглэгчийн үйлдэл">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground/55 transition-colors hover:bg-foreground/[0.06] hover:text-foreground/80 md:flex"
          >
            Нүүр хуудас
          </Link>
          <span className="hidden h-6 w-px bg-foreground/10 md:block" aria-hidden />
          <HeaderNotifications />
          <HeaderProfile />
        </nav>
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

        {/* Sidebar — distinct surface, clear nav hierarchy */}
        <aside
          className={cn(
            "fixed left-0 z-50 flex w-[15.5rem] flex-col border-r border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] transition-transform duration-200 ease-out",
            "top-14 bottom-0",
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full shadow-xl lg:translate-x-0 lg:shadow-none"
          )}
        >
          <div className="flex shrink-0 justify-end border-b border-[var(--dashboard-border)] p-2 lg:hidden">
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

          <nav className="flex-1 overflow-y-auto px-3 py-4 lg:px-4" aria-label="Үндсэн цэс">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground/45">
              Үндсэн цэс
            </p>
            <ul className="space-y-0.5">
              {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = href !== "#" && pathname === href;
                const isExternal = href === "#";
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "bg-primary text-white shadow-sm [box-shadow:0_1px_2px_rgba(0,0,0,0.05)]"
                          : "text-foreground/75 hover:bg-foreground/[0.06] hover:text-foreground",
                        isExternal && "pointer-events-none opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md",
                          isActive ? "bg-white/20 text-white" : "bg-foreground/[0.08] text-foreground/70"
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                      {isExternal && (
                        <span className="shrink-0 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
                          Удахгүй
                        </span>
                      )}
                      {!isExternal && !isActive && (
                        <ChevronRight className="size-4 shrink-0 text-foreground/35" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-[var(--dashboard-border)] p-3 lg:p-4">
            <p className="mb-2 truncate px-3 py-2 text-xs font-medium text-foreground/65">
              {user?.companyName}
            </p>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3 rounded-lg py-2.5 text-sm font-medium text-foreground/70 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="size-4 shrink-0" />
              <span>Гарах</span>
            </Button>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-[15.5rem]">
          <main className="min-h-0 flex-1 bg-[var(--dashboard-sidebar)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
