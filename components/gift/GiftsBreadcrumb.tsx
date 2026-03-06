import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { BreadcrumbItem } from "@/components/ui/breadcrumb";

interface GiftsBreadcrumbProps {
  activeFilter: string | null;
}

export function GiftsBreadcrumb({ activeFilter }: GiftsBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: "Нүүр", href: "/" },
    { label: "Бэлгүүд", href: "/gifts" },
    ...(activeFilter ? [{ label: activeFilter, href: null }] : []),
  ];
  return <Breadcrumb items={items} />;
}
