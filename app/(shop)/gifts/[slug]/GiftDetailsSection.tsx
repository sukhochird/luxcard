import type { Gift } from "@/lib/types";
import { FileText, Info, Shield } from "lucide-react";

const DEFAULT_HOW_TO_USE = `• Бэлэг картыг имэйлээр хүлээн авна.
• Имэйл дэх код болон зааварчилгааг хадгална.
• Тухайн худалдаа эрхлэгчийн салбарт очно (байршил болон цагийг "Байршил болон мэдээлэл" дарж харна).
• Үйлчилгээ авахдаа кодоо харуулж ашиглана.`;

const DEFAULT_TERMS = `• Карт худалдан авахаас хойш 12 сар хүчинтэй.
• Зөвхөн заасан худалдаа эрхлэгчид ашиглана.
• Бэлэн мөнгө болгон солих, буцаан авах боломжгүй.
• Нэмэлт нөхцөл нь худалдаа эрхлэгчийн дүрмийн дагуу.`;

interface GiftDetailsSectionProps {
  gift: Gift;
}

export function GiftDetailsSection({ gift }: GiftDetailsSectionProps) {
  const { description, howToUse, termsOfUse } = gift;
  const useHowTo = howToUse?.trim() || DEFAULT_HOW_TO_USE;
  const useTerms = termsOfUse?.trim() || DEFAULT_TERMS;

  return (
    <section
      className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm sm:p-6"
      aria-labelledby="gift-details-heading"
    >
      <h2 id="gift-details-heading" className="sr-only">
        Дэлгэрэнгүй мэдээлэл
      </h2>

      <div className="space-y-6">
        {/* Дэлгэрэнгүй */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Info className="size-4 text-primary" aria-hidden />
            Дэлгэрэнгүй
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Хэрхэн ашиглах */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="size-4 text-primary" aria-hidden />
            Хэрхэн ашиглах
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
            {useHowTo}
          </p>
        </div>

        {/* Ашиглах нөхцөл */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Shield className="size-4 text-primary" aria-hidden />
            Ашиглах нөхцөл
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
            {useTerms}
          </p>
        </div>
      </div>
    </section>
  );
}
