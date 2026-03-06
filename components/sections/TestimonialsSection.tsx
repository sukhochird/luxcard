import Image from "next/image";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Харилцагчийнхаа төрсөн өдрийн бэлгийг LuxCard-аар илгээсэн. Хэдхэн минут болоход имэйлээр хүрч, маш их таалагдсан.",
    author: "Б. Сарнай",
    role: "Хувийн хэрэглэгч",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
  },
  {
    quote:
      "Ресторан маань LuxCard-тай хамтран ажиллаж байна. Бэлгийн картын борлуулалт нэмэгдсэн, шинэ зочдод танилцуулах боломж олдсон.",
    author: "Д. Отгонбаяр",
    role: "Rosewood Restaurant",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
  },
  {
    quote:
      "Айлчлалын бэлгийг спа картаар илгээсэн. Аюулгүй төлбөр, шууд хүргэлт — дахиад ашиглана.",
    author: "Г. Нарантуяа",
    role: "Хувийн хэрэглэгч",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="testimonials-heading"
          className="text-3xl font-bold text-foreground sm:text-4xl"
        >
          Үйлчлүүлэгчийн сэтгэгдэл
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          LuxCard ашигласан хэрэглэгч, худалдаа эрхлэгчдийн туршлага.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ quote, author, role, avatar }) => (
            <blockquote
              key={author}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-lg"
            >
              <div className="relative p-6 pb-4">
                <Quote
                  className="absolute right-5 top-6 size-9 text-primary/15"
                  aria-hidden
                />
                <p className="relative pr-8 text-[15px] leading-relaxed text-foreground/90">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
              <footer className="mt-auto flex items-center gap-4 border-t border-foreground/10 bg-foreground/[0.02] px-6 py-4">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                  <Image
                    src={avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <cite className="not-italic font-semibold text-foreground">
                    {author}
                  </cite>
                  <p className="text-sm text-foreground/60">{role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
