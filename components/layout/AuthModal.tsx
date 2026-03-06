"use client";

import { useState, useCallback, memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Phone, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

type Step = "credentials" | "verify";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const inputWrapperClass =
  "relative flex items-center rounded-xl border border-foreground/20 bg-foreground/[0.03] transition-colors has-[:focus]:border-primary/50 has-[:focus]:ring-2 has-[:focus]:ring-primary/20 dark:bg-foreground/[0.06]";
const inputClass =
  "w-full min-w-0 rounded-xl border-0 bg-transparent px-4 py-3 pl-10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-0";
const inputIconClass = "absolute left-3 top-1/2 -translate-y-1/2 size-5 text-foreground/40 pointer-events-none";

function AuthModalComponent({ open, onClose }: AuthModalProps) {
  const { login, sendVerificationCode } = useAuth();
  const [step, setStep] = useState<Step>("credentials");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setStep("credentials");
    setPhone("");
    setCode("");
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(() => {
      reset();
      onClose();
    }, 200);
  }, [onClose, reset]);

  useEffect(() => {
    if (open) {
      reset();
      setMounted(false);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMounted(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const el = panelRef.current;
    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first) return;
    first.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [open, step]);

  const handleSendCode = async () => {
    setError(null);
    const trimmed = phone.replace(/\D/g, "");
    if (trimmed.length < 8) {
      setError("Утасны дугаараа зөв оруулна уу (наад зах 8 орон).");
      return;
    }
    setLoading(true);
    const res = await sendVerificationCode(phone);
    setLoading(false);
    if (res.success) setStep("verify");
    else setError(res.error ?? "Код илгээж чадсангүй.");
  };

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendCode();
  };

  const handleSubmitVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(phone, "", code);
    setLoading(false);
    if (res.success) handleClose();
    else setError(res.error ?? "Нэвтрэхэд алдаа гарлаа.");
  };

  if (!open) return null;

  const maskedPhone =
    phone.replace(/\D/g, "").length >= 4
      ? "••••" + phone.replace(/\D/g, "").slice(-4)
      : phone;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-desc"
    >
      <div
        className={cn(
          "absolute inset-0 bg-foreground/70 backdrop-blur-md transition-opacity duration-200",
          mounted ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        className={cn(
          "relative w-full max-w-[400px] rounded-2xl border border-foreground/10 bg-background shadow-2xl transition-all duration-200",
          mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-foreground/10 px-6 py-5">
          <div>
            <h2 id="auth-modal-title" className="text-xl font-semibold text-foreground">
              Нэвтрэх
            </h2>
            <p id="auth-modal-desc" className="mt-0.5 text-sm text-foreground/60">
              {step === "credentials"
                ? "Утасны дугаар эсвэл Google-ээр нэвтэрнэ үү."
                : "Утас руу ирсэн 6 оронтой кодыг оруулна уу."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Хаах"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          {step === "credentials" ? (
            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-phone" className="block text-sm font-medium text-foreground">
                  Утасны дугаар
                </label>
                <div className={inputWrapperClass}>
                  <Phone className={cn(inputIconClass, "shrink-0")} aria-hidden />
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="Жишээ: 80123456"
                    autoComplete="tel"
                    aria-required="true"
                  />
                </div>
              </div>

              {error && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 font-medium transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ backgroundColor: "#0052FF" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                    Код илгээж байна…
                  </>
                ) : (
                  "Код илгээх"
                )}
              </Button>

              <div className="relative py-2">
                <span className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-foreground/10" />
                </span>
                <span className="relative flex justify-center text-xs text-foreground/50">
                  эсвэл
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full rounded-xl border border-foreground/15 py-3 font-medium transition-colors hover:bg-foreground/5"
                onClick={() => {}}
                aria-label="Google-ээр нэвтрэх"
              >
                <svg className="mr-2 size-5" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google-ээр нэвтрэх
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitVerify} className="space-y-4">
              <p className="rounded-xl bg-foreground/5 px-3 py-2.5 text-sm text-foreground/80">
                <strong className="text-foreground">{maskedPhone}</strong> утас руу илгээсэн кодыг оруулна уу.
              </p>
              <div className="space-y-1.5">
                <label htmlFor="auth-code" className="block text-sm font-medium text-foreground">
                  Баталгаажуулах код
                </label>
                <div className={inputWrapperClass}>
                  <KeyRound className={cn(inputIconClass, "shrink-0")} aria-hidden />
                  <input
                    id="auth-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className={cn(
                      inputClass,
                      "text-center text-lg tracking-[0.4em] tabular-nums"
                    )}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    aria-required="true"
                    aria-describedby="auth-code-hint"
                  />
                </div>
                <p id="auth-code-hint" className="text-xs text-foreground/50">
                  6 оронтой кодыг оруулна уу.
                </p>
              </div>

              {error && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-xl py-3 font-medium"
                  onClick={() => setStep("credentials")}
                  disabled={loading}
                >
                  Буцах
                </Button>
                <Button
                  type="submit"
                  disabled={loading || code.length < 4}
                  className="flex-1 rounded-xl py-3 font-medium transition-all hover:shadow-md disabled:opacity-60"
                  style={{ backgroundColor: "#0052FF" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                      Түр хүлээнэ үү…
                    </>
                  ) : (
                    "Нэвтрэх"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const el = typeof document !== "undefined" ? document.body : null;
  if (!el) return null;

  return createPortal(modalContent, el);
}

export const AuthModal = memo(AuthModalComponent);
