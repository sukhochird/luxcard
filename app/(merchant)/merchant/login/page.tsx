"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantAuth } from "@/store/merchant-auth";

export default function MerchantLoginPage() {
  const router = useRouter();
  const { login } = useMerchantAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      router.push("/merchant/dashboard");
      return;
    }
    setError(res.error ?? "Нэвтрэхэд алдаа гарлаа.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
          <div className="text-center">
            <Link
              href="/"
              className="text-xl font-semibold text-foreground hover:text-primary"
            >
              LuxCard
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Худалдаа эрхлэгчийн нэвтрэх
            </h1>
            <p className="mt-2 text-sm text-foreground/70">
              Имэйл болон нууц үгээ оруулна уу
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="merchant-email"
                className="block text-sm font-medium text-foreground"
              >
                Имэйл
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-foreground/40" />
                <input
                  id="merchant-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-foreground/20 bg-foreground/[0.03] py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="name@company.mn"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="merchant-password"
                className="block text-sm font-medium text-foreground"
              >
                Нууц үг
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-foreground/40" />
                <input
                  id="merchant-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-foreground/20 bg-foreground/[0.03] py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Нэвтрэж байна…
                </>
              ) : (
                "Нэвтрэх"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-foreground/60">
            Туршилтын данс: demo@luxcard.mn / demo123
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-foreground/70">
          <Link href="/" className="text-primary hover:underline">
            ← Нүүр хуудас руу буцах
          </Link>
        </p>
      </div>
    </div>
  );
}
