"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Бэлгийн картыг хэрхэн ашиглах вэ?",
    answer:
      "Бэлгийн карт хүлээн авсны дараа имэйлд ирсэн код эсвэл холбоосоор худалдаа эрхлэгчийн газар үйлчилгээ авахад үзүүлнэ. Кодыг касс дээр эсвэл онлайн захиалгад оруулж болно.",
  },
  {
    question: "Төлбөр хийхэд аюулгүй юу?",
    answer:
      "Тийм. LuxCard баталгаажсан төлбөрийн систем ашигладаг. Бүх төлбөр шифрлэгдсэн холболтоор дамжина.",
  },
  {
    question: "Бэлгийн картыг хэзээ хүргэх вэ?",
    answer:
      "Төлбөр амжилттай болсны дараа карт имэйлээр шууд илгээгдэнэ. Ихэнх тохиолдолд хэдхэн минутын дотор хүлээн авагч ирүүлэлтээ авна.",
  },
  {
    question: "Картын хугацаа хэдийг хүртэл вэ?",
    answer:
      "Бэлгийн карт бүр худалдаа эрхлэгчийн дүрмийн дагуу хүчинтэй. Ихэнх карт 6–12 сар хүчинтэй. Дэлгэрэнгүйг картын хуудас дээрээс шалгана уу.",
  },
];

export function GiftDetailFAQ() {
  return (
    <section
      className="mt-14 border-t border-foreground/10 pt-10"
      aria-labelledby="gift-faq-heading"
    >
      <h2
        id="gift-faq-heading"
        className="text-xl font-bold text-foreground sm:text-2xl"
      >
        Түгээмэл асуулт
      </h2>
      <ul className="mt-6 space-y-2">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <li key={question}>
            <details
              className={cn(
                "group rounded-xl border border-foreground/10 bg-background shadow-sm transition-colors hover:border-foreground/15",
                "[&[open]]:border-primary/30 [&[open]]:ring-1 [&[open]]:ring-primary/20"
              )}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-5 sm:py-4">
                <span>{question}</span>
                <ChevronDown
                  className="size-5 shrink-0 text-foreground/50 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-foreground/10 px-4 py-3.5 sm:px-5 sm:py-4">
                <p className="text-sm text-foreground/80">{answer}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
