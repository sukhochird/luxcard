"use client";

import { create } from "zustand";
import type { MerchantSession } from "@/lib/merchant-auth-mock";
import {
  getMerchantSession,
  merchantLogout as apiLogout,
  merchantLogin as apiLogin,
} from "@/lib/merchant-auth-mock";

type MerchantAuthState = {
  session: MerchantSession | null;
  isLoading: boolean;
  setSession: (session: MerchantSession | null) => void;
  hydrate: () => void;
  logout: () => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
};

export const useMerchantAuthStore = create<MerchantAuthState>()((set, get) => ({
  session: null,
  isLoading: true,

  setSession: (session) => set({ session }),

  hydrate: () => {
    set({ session: getMerchantSession(), isLoading: false });
  },

  logout: () => {
    apiLogout();
    set({ session: null });
  },

  login: async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res.success && res.session) set({ session: res.session });
    return { success: res.success, error: res.error };
  },
}));

export function useMerchantAuth() {
  const user = useMerchantAuthStore((s) => s.session?.user ?? null);
  const isLoading = useMerchantAuthStore((s) => s.isLoading);
  const login = useMerchantAuthStore((s) => s.login);
  const logout = useMerchantAuthStore((s) => s.logout);
  const hydrate = useMerchantAuthStore((s) => s.hydrate);
  return { user, isLoading, login, logout, hydrate };
}
