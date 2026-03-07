import Link from "next/link";
import { Twitter, Facebook, Instagram } from "lucide-react";

const FOOTER_LINKS = {
  company: [
    { label: "Бидний тухай", href: "/about" },
    { label: "Карьер", href: "#" },
    { label: "Хэвлэл", href: "#" },
  ],
  merchants: [
    { label: "Үнийн төлөвлөгөө", href: "/pricing" },
    { label: "Хамтрагч болох", href: "#" },
    { label: "Нэвтрэх (худалдаа эрхлэгч)", href: "/merchant/login" },
  ],
  support: [
    { label: "Тусламж", href: "#" },
    { label: "Холбоо барих", href: "#" },
    { label: "Картын үлдэгдэл", href: "#" },
  ],
  legal: [
    { label: "Үйлчилгээний нөхцөл", href: "#" },
    { label: "Нууцлалын бодлого", href: "#" },
    { label: "Күүки бодлого", href: "#" },
  ],
};

const SOCIAL = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-foreground/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start gap-y-10 lg:flex-nowrap">
          <div className="min-w-0 basis-full shrink-0 lg:basis-auto">
            <p className="text-xl font-semibold text-foreground">LuxCard</p>
            <p className="mt-3 max-w-sm text-sm text-foreground/70">
              Монгол дахь ресторан, салон, туршлагын бэлгийн карт. Баярыг
              секундэд илгээнэ.
            </p>
            <div className="mt-6 flex gap-4">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex size-10 items-center justify-center rounded-2xl border border-foreground/20 bg-background text-foreground/70 transition-all duration-200 hover:border-primary hover:text-primary"
                  aria-label={label}
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
          <nav
            className="ml-auto flex min-w-0 flex-wrap items-start gap-x-12 gap-y-10 lg:flex-nowrap lg:gap-x-10"
            aria-label="Хөлийн холбоосууд"
          >
            <div className="min-w-0 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">Компани</h3>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS.company.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">
                Худалдаа эрхлэгчдэд
              </h3>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS.merchants.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">Дэмжлэг</h3>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS.support.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">Эрх зүй</h3>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS.legal.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-12 border-t border-foreground/10 pt-8 text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} LuxCard. Монголын бэлгийн карт.
        </div>
      </div>
    </footer>
  );
}
