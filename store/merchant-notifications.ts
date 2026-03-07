"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MerchantNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO
  type?: "order" | "info" | "alert";
}

type NotificationsState = {
  items: MerchantNotification[];
  add: (n: Omit<MerchantNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  unreadCount: () => number;
};

function makeId() {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const MOCK_INITIAL: MerchantNotification[] = [
  {
    id: makeId(),
    title: "Шинэ захиалга",
    message: "Rosewood Restaurant бэлгийн карт 100,000₮ захиалга ирлээ.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: "order",
  },
  {
    id: makeId(),
    title: "Төлбөр төгссөн",
    message: "Захиалга #2847 амжилттай төлөгдлөө.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: "info",
  },
  {
    id: makeId(),
    title: "Санал болголт",
    message: "Энэ сарын онцлох картаа нэмээд борлуулалтаа нэмэгдүүлээрэй.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: "info",
  },
];

export const useMerchantNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: MOCK_INITIAL,

      add: (n) =>
        set((s) => ({
          items: [
            {
              ...n,
              id: makeId(),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...s.items,
          ],
        })),

      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, read: true } : i
          ),
        })),

      markAllRead: () =>
        set((s) => ({
          items: s.items.map((i) => ({ ...i, read: true })),
        })),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      unreadCount: () => get().items.filter((i) => !i.read).length,
    }),
    { name: "luxcard-merchant-notifications" }
  )
);
