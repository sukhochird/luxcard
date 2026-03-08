import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href: string | null;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center rounded-lg bg-background", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-foreground/80 sm:gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1 sm:gap-1.5">
            {i > 0 && (
              <ChevronRight
                className="size-3.5 shrink-0 text-foreground/40"
                aria-hidden
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
