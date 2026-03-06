import { SuccessContent } from "./SuccessContent";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const orderId = resolved.orderId
    ? Array.isArray(resolved.orderId)
      ? resolved.orderId[0]
      : resolved.orderId
    : "";
  const redeemCode = resolved.redeemCode
    ? Array.isArray(resolved.redeemCode)
      ? resolved.redeemCode[0]
      : resolved.redeemCode
    : "";

  return (
    <SuccessContent orderId={orderId ?? ""} redeemCode={redeemCode ?? ""} />
  );
}
