"use client";

import { create } from "zustand";
import type { AuthSession } from "@/lib/auth-mock";
import { getSession, logout as apiLogout } from "@/lib/auth-mock";

type AuthState = {
  session: AuthSession | null;
  isLoading: boolean;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
  logout: () => void;
  login: (
    phone: string,
    password: string,
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    phone: string,
    code: string,
    email?: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  sendVerificationCode: (
    phone: string
  ) => Promise<{ success: boolean; error?: string }>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  session: null,
  isLoading: true,

  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),

  hydrate: () => {
    set({ session: getSession(), isLoading: false });
  },

  logout: () => {
    apiLogout();
    set({ session: null });
  },

  sendVerificationCode: async (phone: string) => {
    const { sendVerificationCode: send } = await import("@/lib/auth-mock");
    return send(phone);
  },

  login: async (phone: string, password: string, code: string) => {
    const { login: doLogin } = await import("@/lib/auth-mock");
    const res = await doLogin(phone, password, code);
    if (res.success && res.session) set({ session: res.session });
    return { success: res.success, error: res.error };
  },

  register: async (
    phone: string,
    code: string,
    email?: string,
    password?: string
  ) => {
    const { register: doRegister } = await import("@/lib/auth-mock");
    const res = await doRegister(phone, code, email, password);
    if (res.success && res.session) set({ session: res.session });
    return { success: res.success, error: res.error };
  },
}));

export function useAuth() {
  const user = useAuthStore((s) => s.session?.user ?? null);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const sendVerificationCode = useAuthStore((s) => s.sendVerificationCode);
  return {
    user,
    isLoading,
    login,
    register,
    logout,
    sendVerificationCode,
  };
}
