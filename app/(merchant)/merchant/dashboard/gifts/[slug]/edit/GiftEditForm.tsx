"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Gift, GiftCategory, GiftLocation, GiftOccasion } from "@/lib/types";
import { apiPatch } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const CATEGORIES: GiftCategory[] = [
  "Restaurant",
  "Coffee Shop",
  "Beauty & Spa",
  "Fitness",
  "Entertainment",
  "Hotel",
  "Travel",
  "Retail",
];

const LOCATIONS: GiftLocation[] = ["Ulaanbaatar", "Darkhan", "Erdenet"];

const OCCASIONS: GiftOccasion[] = [
  "Birthday",
  "Wedding",
  "Holiday",
  "New Year",
  "Valentine's",
  "Corporate",
  "Graduation",
  "Lunar New Year",
  "Mother's Day",
  "Father's Day",
  "Housewarming",
  "Baby Shower",
  "Thank You",
  "Get Well Soon",
  "Congratulations",
];

interface GiftEditFormProps {
  slug: string;
  gift: Gift;
}

export function GiftEditForm({ slug, gift }: GiftEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(gift.title);
  const [merchant, setMerchant] = useState(gift.merchant);
  const [category, setCategory] = useState<GiftCategory>(gift.category);
  const [location, setLocation] = useState<GiftLocation>(gift.location);
  const [occasion, setOccasion] = useState<GiftOccasion[]>([...gift.occasion]);
  const [priceOptionsStr, setPriceOptionsStr] = useState(
    gift.priceOptions.join(", ")
  );
  const [featured, setFeatured] = useState(gift.featured);
  const [image, setImage] = useState(gift.image);
  const [description, setDescription] = useState(gift.description);
  const [discountPercent, setDiscountPercent] = useState(
    gift.discountPercent ?? ""
  );
  const [howToUse, setHowToUse] = useState(gift.howToUse ?? "");
  const [termsOfUse, setTermsOfUse] = useState(gift.termsOfUse ?? "");

  const toggleOccasion = (occ: GiftOccasion) => {
    setOccasion((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const priceOptions = priceOptionsStr
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n > 0);
    if (priceOptions.length === 0) {
      setError("Үнийн сонголт дор хаяж нэг байх ёстой.");
      setSaving(false);
      return;
    }
    try {
      await apiPatch(`/api/gifts/${slug}`, {
        title,
        merchant,
        category,
        location,
        occasion,
        priceOptions,
        featured,
        image,
        description,
        discountPercent:
          discountPercent === ""
            ? undefined
            : Math.min(100, Math.max(0, parseInt(discountPercent, 10) || 0)),
        howToUse: howToUse || undefined,
        termsOfUse: termsOfUse || undefined,
      });
      router.push(`/merchant/dashboard/gifts/${slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Гарчиг
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Rosewood Restaurant Gift Card"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Худалдаа эрхлэгч
          </label>
          <Input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            required
            placeholder="Rosewood Restaurant"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Ангилал
          </label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as GiftCategory)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Байршил
          </label>
          <Select
            value={location}
            onValueChange={(v) => setLocation(v as GiftLocation)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Үнийн сонголтууд (₮) — таслалаар тусгаарлана
          </label>
          <Input
            value={priceOptionsStr}
            onChange={(e) => setPriceOptionsStr(e.target.value)}
            placeholder="50000, 100000, 200000"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(v) => setFeatured(!!v)}
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-foreground/80 cursor-pointer"
          >
            Онцлох карт
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Зургийн URL
          </label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Тайлбар
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={cn(
              "flex w-full rounded-2xl border border-foreground/20 bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
            )}
            placeholder="Бэлгийн картын тайлбар..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Хөнгөлөлт (%)
          </label>
          <Input
            type="number"
            min={0}
            max={100}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="10"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Тохирох үзэгдэл
          </label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => (
              <label
                key={occ}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-foreground/20 bg-background px-3 py-2 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
              >
                <input
                  type="checkbox"
                  checked={occasion.includes(occ)}
                  onChange={() => toggleOccasion(occ)}
                  className="size-4 rounded border-foreground/30 text-primary focus:ring-primary"
                />
                {occ}
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Хэрхэн ашиглах (заавар)
          </label>
          <textarea
            value={howToUse}
            onChange={(e) => setHowToUse(e.target.value)}
            rows={2}
            className={cn(
              "flex w-full rounded-2xl border border-foreground/20 bg-background px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
            placeholder="Заавар (заавал биш)"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            Ашиглах нөхцөл
          </label>
          <textarea
            value={termsOfUse}
            onChange={(e) => setTermsOfUse(e.target.value)}
            rows={2}
            className={cn(
              "flex w-full rounded-2xl border border-foreground/20 bg-background px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
            placeholder="Нөхцөл (заавал биш)"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-6">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Хадгалж байна...
            </>
          ) : (
            "Хадгалах"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/merchant/dashboard/gifts/${slug}`} className="gap-2">
            <ArrowLeft className="size-4" />
            Цуцлах
          </Link>
        </Button>
      </div>
    </form>
  );
}
