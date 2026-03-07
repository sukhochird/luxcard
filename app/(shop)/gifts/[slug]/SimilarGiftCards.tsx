import { GiftCard } from "@/components/gift/GiftCard";
import type { Gift } from "@/lib/types";

interface SimilarGiftCardsProps {
  gifts: Gift[];
  currentSlug: string;
}

export function SimilarGiftCards({ gifts, currentSlug }: SimilarGiftCardsProps) {
  const list = gifts.filter((g) => g.slug !== currentSlug).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section
      className="mt-14 border-t border-foreground/10 pt-10"
      aria-labelledby="similar-gifts-heading"
    >
      <h2
        id="similar-gifts-heading"
        className="text-xl font-bold text-foreground sm:text-2xl"
      >
        Ижил санал болгох бусад картууд
      </h2>
      <p className="mt-1 text-sm text-foreground/70">
        Ижил ангилалд багтах бусад бэлгийн картууд.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ижил санал болгох картуудын жагсаалт">
        {list.map((item) => (
          <li key={item.id}>
            <GiftCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
