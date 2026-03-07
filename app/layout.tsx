import type { Metadata } from "next";
import { AuthHydration } from "@/components/AuthHydration";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

/* Brand reference: Coinbase-style palette — Blue Ribbon (#0052FF), White (#FFFFFF), Woodsmoke (#0A0B0D). */

const SITE_URL = "https://luxcard.mn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LuxCard — Монгол дахь орон нутгийн бэлгийн карт",
    template: "%s — LuxCard",
  },
  description:
    "Ресторан, салон, кофе шоп, туршлага — Монгол дахь орон нутгийн бэлгийн картыг шууд илгээнэ. Улаанбаатар, Дархан, Эрдэнэт.",
  keywords: [
    "бэлгийн карт",
    "Монгол",
    "Улаанбаатар",
    "орон нутгийн бизнес",
    "ресторан",
    "спа",
    "кофе",
    "LuxCard",
  ],
  authors: [{ name: "LuxCard", url: SITE_URL }],
  creator: "LuxCard",
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "LuxCard",
    title: "LuxCard — Монгол дахь орон нутгийн бэлгийн карт",
    description:
      "Ресторан, салон, кофе шоп, туршлага — Монгол дахь орон нутгийн бэлгийн картыг шууд илгээнэ.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxCard — Монгол дахь орон нутгийн бэлгийн карт",
    description:
      "Ресторан, салон, кофе шоп — Монгол дахь орон нутгийн бэлгийн картыг шууд илгээнэ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <OrganizationJsonLd />
        <ThemeProvider>
          <AuthHydration />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
