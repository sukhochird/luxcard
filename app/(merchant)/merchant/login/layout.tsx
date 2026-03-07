import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Худалдаа эрхлэгч нэвтрэх",
  description: "LuxCard худалдаа эрхлэгчийн данс руу нэвтрэх.",
};

export default function MerchantLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
