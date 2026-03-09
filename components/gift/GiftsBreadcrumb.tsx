import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { BreadcrumbItem } from "@/components/ui/breadcrumb";

function decodeFilterLabel(raw: string): string {
  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return raw;
  }
}

interface GiftsBreadcrumbProps {
  activeFilter: string | null;
}

export function GiftsBreadcrumb({ activeFilter }: GiftsBreadcrumbProps) {
  const label = activeFilter ? decodeFilterLabel(activeFilter) : null;
  const items: BreadcrumbItem[] = [
    { label: "Нүүр", href: "/" },
    { label: "Бэлгийн картууд", href: "/gifts" },
    ...(label ? [{ label, href: null }] : []),
  ];
  return <Breadcrumb items={items} />;
}
