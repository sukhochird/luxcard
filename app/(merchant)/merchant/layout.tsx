import { MerchantHydration } from "@/components/MerchantHydration";
import Link from "next/link";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MerchantHydration />
      <div className="min-h-screen bg-foreground/[0.02]">
        {children}
      </div>
    </>
  );
}
