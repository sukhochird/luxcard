"use client";

import { useState } from "react";
import { Bell, Check, ShoppingBag, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useMerchantNotificationsStore,
  type MerchantNotification,
} from "@/store/merchant-notifications";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60 * 1000) return "Саяхан";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} мин`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} цаг`;
  return d.toLocaleDateString("mn-MN", { day: "numeric", month: "short" });
}

function NotifIcon({ type }: { type?: MerchantNotification["type"] }) {
  switch (type) {
    case "order":
      return <ShoppingBag className="size-4 shrink-0 text-primary" />;
    case "alert":
      return <AlertCircle className="size-4 shrink-0 text-amber-500" />;
    default:
      return <Info className="size-4 shrink-0 text-foreground/60" />;
  }
}

export function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const {
    items,
    markRead,
    markAllRead,
    unreadCount,
  } = useMerchantNotificationsStore();
  const unread = unreadCount();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 shrink-0"
          aria-label={
            unread > 0
              ? `Мэдэгдэл ${unread} шинэ`
              : "Мэдэгдлийн жагсаалт"
          }
        >
          <Bell className="size-5 text-foreground/80" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
          <h3 className="font-semibold text-foreground">Мэдэгдэл</h3>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAllRead()}
              className="text-xs font-medium text-primary hover:underline"
            >
              Бүгдийг уншсан болгох
            </button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-foreground/50">
              Мэдэгдэл байхгүй
            </div>
          ) : (
            <ul className="divide-y divide-foreground/5">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "group flex gap-3 px-4 py-3 transition-colors hover:bg-foreground/[0.03]",
                    !n.read && "bg-primary/[0.04]"
                  )}
                >
                  <NotifIcon type={n.type} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm",
                        !n.read ? "font-medium text-foreground" : "text-foreground/80"
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-foreground/60">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] text-foreground/40">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-start gap-1">
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 opacity-0 group-hover:opacity-100"
                        onClick={() => markRead(n.id)}
                        aria-label="Уншсан болгох"
                      >
                        <Check className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
