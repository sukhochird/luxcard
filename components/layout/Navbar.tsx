"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Syne } from "next/font/google";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from "react";
import { ShoppingCart, Menu, X, ChevronDown, ChevronRight, User, Package, LogOut, Info, FileText, Briefcase, ArrowRight, Gift, Zap, Shield, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { AuthModal } from "@/components/layout/AuthModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

const fontLogo = Syne({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

const SearchBar = dynamic(
  () =>
    import("@/components/search/SearchBar").then((m) => ({ default: m.SearchBar })),
  { ssr: false }
);

const MAIN_LINKS = [
  { href: "/gifts", label: "Бэлгүүд" },
] as const;

const MEGA_MENU_CATEGORIES: { href: string; label: string }[] = [
  { href: "/about", label: "Танилцуулга" },
  { href: "/pricing", label: "Үнийн төлөвлөгөө" },
  { href: "/merchant/login", label: "Худалдаа эрхлэгч нэвтрэх" },
  { href: "/blog", label: "Блог" },
  { href: "/careers", label: "Карьер" },
];

const MEGA_MENU_FEATURES: { href: string; title: string; description: string; icon: typeof Gift }[] = [
  { href: "/gifts", title: "Бэлгийн карт", description: "Олон төрлийн бэлэг, ресторан, спа сонгох", icon: Gift },
  { href: "/gifts", title: "Шууд илгээх", description: "Имэйлээр хүргэгдэнэ, хүлээлгүй", icon: Zap },
  { href: "/about", title: "Аюулгүй төлбөр", description: "Баталгаажсан төлбөрийн систем", icon: Shield },
];

const MEGA_MENU_LEAVE_DELAY_MS = 220;

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const NavLink = memo(function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isActive
          ? "text-primary"
          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
});

function CompanyMegaMenuDesktop({
  isOpen,
  onOpen,
  onClose,
  onToggle,
  panelRef,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}) {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    clearCloseTimeout();
    onOpen();
  }, [onOpen, clearCloseTimeout]);

  const handleLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(onClose, MEGA_MENU_LEAVE_DELAY_MS);
  }, [onClose]);

  useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  return (
    <div
      className="relative overflow-visible"
      ref={panelRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="company-mega-menu"
        id="company-trigger"
        className={cn(
          "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isOpen
            ? "text-primary"
            : "text-foreground/80 hover:bg-foreground/[0.06] hover:text-foreground"
        )}
      >
        Company
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden
        />
        {isOpen && (
          <span
            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
            aria-hidden
          />
        )}
      </button>
      <div
        id="company-mega-menu"
        role="menu"
        aria-labelledby="company-trigger"
        className={cn(
          "fixed left-0 right-0 top-16 z-50 transition-[opacity,transform] duration-200 ease-out",
          isOpen
            ? "translate-y-0 opacity-100 visible"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-b-2xl border border-t-0 border-foreground/10 bg-background shadow-xl shadow-foreground/10">
            {/* Accent bar */}
            <div className="h-0.5 bg-primary/20" aria-hidden />
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr_auto] sm:gap-8">
                {/* Categories */}
                <nav className="flex flex-col" aria-label="Компаний цэс">
              <span className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Explore
              </span>
              <ul className="flex flex-col gap-0.5">
                {MEGA_MENU_CATEGORIES.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      role="menuitem"
                      className="group/link flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    >
                      {item.label}
                      <ChevronRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover/link:text-primary" aria-hidden />
                    </Link>
                  </li>
                ))}
                </ul>
                </nav>
                {/* Feature cards */}
                <div className="flex flex-col gap-3 border-foreground/10 sm:border-l sm:pl-6 sm:pr-6">
              <span className="mb-0.5 px-0.5 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Why LuxCard
              </span>
              {MEGA_MENU_FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    role="menuitem"
                    className="group/card flex gap-3 rounded-xl border border-transparent bg-foreground/[0.03] p-3 transition-all duration-200 hover:border-foreground/10 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover/card:bg-primary/20">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground group-hover/card:text-primary">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-foreground/60">
                        {item.description}
                      </span>
                    </div>
                    <ChevronRight className="size-4 shrink-0 self-center text-foreground/30 transition-colors group-hover/card:text-primary" aria-hidden />
                  </Link>
                );
              })}
                </div>
                {/* CTA */}
                <div className="flex flex-col justify-end border-t border-foreground/10 pt-4 sm:border-t-0 sm:border-l sm:border-foreground/10 sm:pt-0 sm:pl-6">
                  <Link
                    href="/gifts"
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Бэлгийн карт сонгох
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROFILE_LINKS = [
  { href: "/profile", label: "Профайл", icon: User },
  { href: "/orders", label: "Захиалгууд", icon: Package },
] as const;

function NavbarComponent() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const cartCount = getTotalItems();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyExpanded, setCompanyExpanded] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const companyPanelRef = useRef<HTMLDivElement>(null);
  const profilePanelRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openCompany = useCallback(() => setCompanyOpen(true), []);
  const closeCompany = useCallback(() => setCompanyOpen(false), []);
  const toggleCompany = useCallback(() => setCompanyOpen((o) => !o), []);
  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const openCartDrawer = useCallback(() => setCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), []);
  const toggleProfile = useCallback(() => setProfileOpen((o) => !o), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  useClickOutside(profilePanelRef, closeProfile);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useClickOutside(companyPanelRef, closeCompany);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full overflow-visible border-b bg-background/95 backdrop-blur transition-shadow duration-200 supports-[backdrop-filter]:bg-background/60",
        scrolled ? "border-foreground/10 shadow-md" : "border-foreground/10"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6 sm:py-2 lg:px-8">
        <div className="flex min-w-0 shrink items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={cn(
              fontLogo.className,
              "truncate text-base font-semibold text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded sm:text-xl"
            )}
            aria-label="LuxCard нүүр"
          >
            LuxCard
          </Link>
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Үндсэн цэс"
          >
            {MAIN_LINKS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive(item.href)}
              />
            ))}
            <CompanyMegaMenuDesktop
              isOpen={companyOpen}
              onOpen={openCompany}
              onClose={closeCompany}
              onToggle={toggleCompany}
              panelRef={companyPanelRef}
            />
          </nav>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex md:px-4">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground/80 transition-colors active:bg-foreground/10 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:rounded-lg sm:min-w-0 sm:min-h-0 sm:p-2"
            aria-label={resolvedTheme === "dark" ? "Гэрэлтэй горим" : "Харанхуй горим"}
          >
            <Sun className="size-5 dark:hidden" aria-hidden />
            <Moon className="size-5 hidden dark:block" aria-hidden />
          </button>
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground/80 transition-colors active:bg-foreground/10 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:rounded-lg sm:min-w-0 sm:min-h-0 sm:p-2"
            aria-label={cartCount > 0 ? `Сагс, ${cartCount} бараа` : "Сагс"}
          >
            <ShoppingCart className="size-5" aria-hidden />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-background sm:-right-0.5 sm:-top-0.5 sm:h-4 sm:min-w-4">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
          {user ? (
            <div className="relative hidden sm:block" ref={profilePanelRef}>
              <button
                type="button"
                onClick={toggleProfile}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-controls="profile-menu"
                id="profile-trigger"
                className={cn(
                  "flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:scale-[1.02] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  profileOpen && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <User className="size-4" aria-hidden />
                <span className="max-w-[100px] truncate">{user.phone}</span>
                <ChevronDown
                  className={cn("size-4 transition-transform duration-200", profileOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              <div
                id="profile-menu"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="profile-trigger"
                className={cn(
                  "absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-foreground/10 bg-background py-1 shadow-md transition-all duration-200",
                  profileOpen
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                )}
              >
                {PROFILE_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary focus:outline-none"
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeProfile();
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-red-500/10 hover:text-red-600 focus:bg-red-500/10 focus:text-red-600 focus:outline-none"
                >
                  <LogOut className="size-4" aria-hidden />
                  Гарах
                </button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              className="hidden rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:inline-flex"
              style={{ backgroundColor: "#0052FF" }}
              onClick={openAuthModal}
              aria-label="Нэвтрэх"
            >
              Нэвтрэх
            </Button>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground/80 transition-colors active:bg-foreground/10 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:rounded-lg sm:min-w-0 sm:min-h-0 sm:p-2 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Цэс хаах" : "Цэс нээх"}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 top-14 z-40 bg-background/98 backdrop-blur-md md:hidden",
          "transition-[opacity,visibility] duration-300 ease-out",
          mobileOpen
            ? "opacity-100 visible"
            : "pointer-events-none invisible opacity-0"
        )}
        aria-hidden={!mobileOpen}
        onClick={(e) => e.target === e.currentTarget && closeMobile()}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/10 px-4 md:hidden">
          <span className="text-sm font-medium text-foreground/70">Цэс</span>
          <button
            type="button"
            onClick={closeMobile}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground/80 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Цэс хаах"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav
          className={cn(
            "flex flex-col gap-1 overflow-auto overscroll-contain p-4 pb-8 transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-4"
          )}
          aria-label="Гар утасны цэс"
        >
          {MAIN_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-foreground/5"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02]">
            <button
              type="button"
              onClick={() => setCompanyExpanded((e) => !e)}
              aria-expanded={companyExpanded}
              aria-controls="mobile-company-list"
              className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Company
              <ChevronDown
                className={cn("size-5 shrink-0 transition-transform duration-200", companyExpanded && "rotate-180")}
                aria-hidden
              />
            </button>
            <div
              id="mobile-company-list"
              className={cn(
                "grid transition-all duration-300 ease-out",
                companyExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-1 border-t border-foreground/10 px-2 pb-3 pt-2">
                  <span className="mb-1.5 block px-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Explore
                  </span>
                  {MEGA_MENU_CATEGORIES.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    >
                      {item.label}
                      <ChevronRight className="size-4 text-foreground/40" aria-hidden />
                    </Link>
                  ))}
                  <span className="mb-1.5 mt-4 block px-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Why LuxCard
                  </span>
                  {MEGA_MENU_FEATURES.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 rounded-xl bg-background p-3 shadow-sm transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                          <span className="block text-xs text-foreground/60">{item.description}</span>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-foreground/40" aria-hidden />
                      </Link>
                    );
                  })}
                  <Link
                    href="/gifts"
                    onClick={closeMobile}
                    className="mt-3 flex items-center justify-center gap-2 rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Бэлгийн карт сонгох
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              closeMobile();
              openCartDrawer();
            }}
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-medium text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ShoppingCart className="size-4" />
            Сагс {cartCount > 0 && `(${cartCount})`}
          </button>
          <div className="mt-4 flex flex-col gap-2 border-t border-foreground/10 pt-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-foreground/5"
                >
                  <User className="size-4" /> Профайл
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-foreground/5"
                >
                  <Package className="size-4" /> Захиалгууд
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-500/10"
                >
                  <LogOut className="size-4" /> Гарах
                </button>
              </>
            ) : (
                <Button
                  className="w-full rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  style={{ backgroundColor: "#0052FF" }}
                  onClick={() => {
                    closeMobile();
                    openAuthModal();
                  }}
                >
                  Нэвтрэх
                </Button>
            )}
          </div>
        </nav>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <CartDrawer open={cartDrawerOpen} onClose={closeCartDrawer} />
    </header>
  );
}

export const Navbar = memo(NavbarComponent);
