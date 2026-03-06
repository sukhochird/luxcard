import { NextRequest, NextResponse } from "next/server";
import type { CheckoutPayload, CheckoutResponse } from "@/lib/types";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function generateRedeemCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i % 4 === 3 && i < 11) code += "-";
  }
  return code;
}

export async function POST(request: NextRequest) {
  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 }
    );
  }

  const {
    slug,
    amount,
    senderName,
    receiverName,
    receiverEmail,
    message,
    sendOption,
    scheduledAt,
    notifyRecipientBySms,
    receiverPhone,
  } = body;

  if (
    !slug ||
    typeof amount !== "number" ||
    !senderName?.trim() ||
    !receiverName?.trim() ||
    !receiverEmail?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (notifyRecipientBySms && !receiverPhone?.trim()) {
    return NextResponse.json(
      { error: "SMS мэдэгдэл сонгосон бол хүлээн авагчийн утас оруулна уу" },
      { status: 400 }
    );
  }

  if (sendOption === "scheduled" && !scheduledAt?.trim()) {
    return NextResponse.json(
      { error: "Илгээх цаг сонгоно уу" },
      { status: 400 }
    );
  }

  const response: CheckoutResponse = {
    orderId: generateId(),
    redeemCode: generateRedeemCode(),
  };

  return NextResponse.json(response);
}
