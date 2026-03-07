import type { Metadata } from "next";
import { DashboardLayoutClient } from "@/components/merchant/DashboardLayoutClient";

export const metadata: Metadata = {
  title: "Хяналтын самбар",
  description: "LuxCard худалдаа эрхлэгчийн захиалга, орлого, картын тойм.",
};

export default function MerchantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
