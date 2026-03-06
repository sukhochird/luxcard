"use client";

import Image from "next/image";
import { memo } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ShieldCheck,
  CreditCard,
  Truck,
  ExternalLink,
} from "lucide-react";
import type { Merchant as MerchantType } from "@/lib/types";
import { cn } from "@/lib/utils";

const linkClass =
  "text-primary transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded";

function mapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function parseWorkingHours(hours: string): { open: number; close: number } | null {
  const match = hours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const [, oh, om, ch, cm] = match;
  return {
    open: parseInt(oh!, 10) * 60 + parseInt(om!, 10),
    close: parseInt(ch!, 10) * 60 + parseInt(cm!, 10),
  };
}

function isOpenNow(workingHours: string): boolean {
  const parsed = parseWorkingHours(workingHours);
  if (!parsed) return false;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (parsed.close < parsed.open) return minutes >= parsed.open || minutes < parsed.close;
  return minutes >= parsed.open && minutes < parsed.close;
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Баталгаажсан худалдаа эрхлэгч" },
  { icon: CreditCard, label: "Аюулгүй төлбөр" },
  { icon: Truck, label: "Шууд хүргэлт" },
];

interface MerchantInfoProps {
  merchant: MerchantType;
  className?: string;
  showTrustBadges?: boolean;
}

function MerchantInfoComponent({
  merchant,
  className,
  showTrustBadges = true,
}: MerchantInfoProps) {
  const {
    brandName,
    brandLogo,
    shortIntro,
    addressBranches,
    contactPhones,
    facebook,
    instagram,
    email,
    website,
    workingHours,
  } = merchant;

  const openNow = workingHours ? isOpenNow(workingHours) : false;

  const hasAny =
    brandName ||
    brandLogo ||
    shortIntro ||
    (contactPhones?.length ?? 0) > 0 ||
    (addressBranches?.length ?? 0) > 0 ||
    facebook ||
    instagram ||
    email ||
    website ||
    workingHours;

  if (!hasAny) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-foreground/10 bg-background shadow-sm transition-shadow duration-200 overflow-hidden",
        className
      )}
      aria-labelledby="merchant-heading"
    >
      {/* Header: brand + logo + intro */}
      <div className="border-b border-foreground/10 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {brandLogo && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
              <Image
                src={brandLogo}
                alt={brandName ? `${brandName} лого` : "Худалдаа эрхлэгчийн лого"}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="merchant-heading"
                className="text-xl font-bold text-foreground sm:text-2xl"
              >
                {brandName || "Худалдаа эрхлэгч"}
              </h2>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                Баталгаажсан
              </span>
            </div>
            {shortIntro && (
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed max-w-2xl">
                {shortIntro}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 sm:px-8 sm:py-6 space-y-6">
        {/* Location — simple list with map links */}
        {addressBranches && addressBranches.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="size-4 text-primary" aria-hidden />
              Байршил
            </h3>
            <ul className="space-y-2" role="list">
              {addressBranches.map((line, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm text-foreground">{line}</span>
                  <a
                    href={mapsSearchUrl(line)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-1 text-sm", linkClass)}
                    aria-label="Газрын зураг нээх"
                  >
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                    Газрын зураг
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact info — simple rows, no cards */}
        <div className="space-y-4">
          {contactPhones && contactPhones.length > 0 && (
            <div className="flex gap-3">
              <Phone className="size-4 shrink-0 text-foreground/50 mt-0.5" aria-hidden />
              <div className="min-w-0">
                <p className="text-foreground">
                  {contactPhones.map((num, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      <a href={`tel:${num.replace(/\s/g, "")}`} className={linkClass} aria-label={`Утасдах ${num}`}>
                        {num}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {workingHours && (
            <div className="flex gap-3">
              <Clock className="size-4 shrink-0 text-foreground/50 mt-0.5" aria-hidden />
              <div className="min-w-0 flex flex-wrap items-center gap-2">
                <span className="text-foreground">{workingHours}</span>
                {openNow && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary" aria-label="Одоо нээлттэй">
                    Одоо нээлттэй
                  </span>
                )}
              </div>
            </div>
          )}

          {email && (
            <div className="flex gap-3">
              <Mail className="size-4 shrink-0 text-foreground/50 mt-0.5" aria-hidden />
              <a href={`mailto:${email}`} className={cn("break-all", linkClass)} aria-label={`Имэйл илгээх ${email}`}>
                {email}
              </a>
            </div>
          )}

          {website && (
            <div className="flex gap-3">
              <Globe className="size-4 shrink-0 text-foreground/50 mt-0.5" aria-hidden />
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("inline-flex items-center gap-1 break-all", linkClass)}
                aria-label="Вэб нээх"
              >
                {website}
                <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              </a>
            </div>
          )}

          {(facebook || instagram) && (
            <div className="flex gap-3">
              <div className="size-4 shrink-0 mt-0.5" aria-hidden />
              <div className="flex flex-wrap gap-3">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1.5", linkClass)} aria-label="Facebook">
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    Facebook
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1.5", linkClass)} aria-label="Instagram">
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {showTrustBadges && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-foreground/10 pt-4 text-sm text-foreground/70" role="list" aria-label="Итгэлийн үзүүлэлт">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5" role="listitem">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const MerchantInfo = memo(MerchantInfoComponent);
