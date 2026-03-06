import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Бэлгийн картыг хэрхэн ашиглах вэ?",
    answer:
      "Бэлгийн карт хүлээн авсны дараа таны имэйлд ирсэн код эсвэл холбоосоор merchant-ийн газар үйлчилгээ авахад үзүүлнэ. Кодыг касс дээр эсвэл онлайн захиалгад оруулж болно.",
  },
  {
    question: "Төлбөр хийхэд аюулгүй юу?",
    answer:
      "Тийм. LuxCard баталгаажсан төлбөрийн систем ашигладаг. Картын мэдээлэл таны сервер дээр хадгалагдахгүй, бүх төлбөр шифрлэгдсэн холболтоор дамжина.",
  },
  {
    question: "Бэлгийн картыг хэзээ хүргэх вэ?",
    answer:
      "Төлбөр амжилттай болсны дараа бэлгийн карт имэйлээр шууд илгээгдэнэ. Ихэнх тохиолдолд хэдхэн минутын дотор хүлээн авагч ирүүлэлтээ авна.",
  },
  {
    question: "Merchant болж бэлгийн карт борлуулах боломжтой юу?",
    answer:
      "Тийм. Ресторан, кафе, спа, фитнес зэрэг үйлчилгээний бизнес эрхлэгчид LuxCard-тай хамтран ажиллаж, өөрийн бэлгийн картыг платформ дээр борлуулж болно. Дэлгэрэнгүйг \"Merchant д зориулсан\" хэсгээс уншина уу.",
  },
  {
    question: "Картын хугацаа хэдийг хүртэл вэ?",
    answer:
      "Бэлгийн карт бүр merchant-ийн дүрмийн дагуу хүчинтэй хугацаатай. Ихэнх карт 6–12 сар хүчинтэй байна. Дэлгэрэнгүйг картын хуудас дээрээс шалгана уу.",
  },
];

export function FAQSection() {
  return (
    <section
      id="faq"
      className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="faq-heading"
          className="text-3xl font-bold text-foreground sm:text-4xl"
        >
          Түгээмэл асуулт
        </h2>
        <p className="mt-3 text-lg text-foreground/80">
          LuxCard болон бэлгийн карттай холбоотой асуултуудын хариулт.
        </p>
        <ul className="mt-10 space-y-2">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <li key={question}>
              <details
                className={cn(
                  "group rounded-xl border border-foreground/10 bg-background shadow-sm transition-colors hover:border-foreground/15",
                  "[&[open]]:border-primary/30 [&[open]]:ring-1 [&[open]]:ring-primary/20"
                )}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
                  <span>{question}</span>
                  <ChevronDown
                    className="size-5 shrink-0 text-foreground/50 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-foreground/10 px-5 py-4">
                  <p className="text-foreground/80">{answer}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
