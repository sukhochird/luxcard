import { cn } from "@/lib/utils";

const CR80_ASPECT = 85.6 / 53.98;

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background p-4",
        className
      )}
    >
      <div
        className="animate-pulse rounded-xl bg-foreground/10"
        style={{ aspectRatio: CR80_ASPECT }}
      />
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-foreground/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-foreground/10" />
        <div className="h-3 w-20 animate-pulse rounded bg-foreground/10" />
        <div className="mt-2 h-6 w-24 animate-pulse rounded bg-foreground/10" />
      </div>
    </div>
  );
}
