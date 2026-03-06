import type { Metadata } from "next";
import { AuthHydration } from "@/components/AuthHydration";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

/* Brand reference: Coinbase-style palette — Blue Ribbon (#0052FF), White (#FFFFFF), Woodsmoke (#0A0B0D). */

export const metadata: Metadata = {
  title: "LuxCard — Монгол дахь орон нутгийн бэлгийн карт",
  description:
    "Ресторан, салон, кофе шоп, туршлага — Монгол дахь орон нутгийн бэлгийн картыг шууд илгээнэ.",
  keywords: ["бэлгийн карт", "Монгол", "Улаанбаатар", "орон нутгийн бизнес", "ресторан", "спа", "кофе"],
  openGraph: {
    title: "LuxCard — Монгол дахь орон нутгийн бэлгийн карт",
    description:
      "Ресторан, салон, кофе шоп, туршлага — Монгол дахь орон нутгийн бэлгийн картыг шууд илгээнэ.",
    type: "website",
  },
  metadataBase: new URL("https://luxcard.mn"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider>
          <AuthHydration />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
