export type GiftCategory =
  | "Restaurant"
  | "Coffee Shop"
  | "Beauty & Spa"
  | "Fitness"
  | "Entertainment"
  | "Hotel"
  | "Travel"
  | "Retail";

export type GiftOccasion =
  | "Birthday"
  | "Wedding"
  | "Holiday"
  | "New Year"
  | "Valentine's"
  | "Corporate"
  | "Graduation"
  | "Lunar New Year"
  | "Mother's Day"
  | "Father's Day"
  | "Housewarming"
  | "Baby Shower"
  | "Thank You"
  | "Get Well Soon"
  | "Congratulations";

export type GiftLocation = "Ulaanbaatar" | "Darkhan" | "Erdenet";

export interface Gift {
  id: string;
  slug: string;
  title: string;
  merchant: string;
  category: GiftCategory;
  occasion: GiftOccasion[];
  location: GiftLocation;
  priceOptions: number[];
  featured: boolean;
  image: string;
  images?: string[];
  description: string;
  /** 0–100, applied to selected amount */
  discountPercent?: number;
  /** Хэрхэн ашиглах заавар (optional, fallback to default) */
  howToUse?: string;
  /** Ашиглах нөхцөл (optional, fallback to default) */
  termsOfUse?: string;
}

export type PackagingId = "standard" | "premium" | "giftbag";

export interface CartItem {
  slug: string;
  amount: number;
  packaging: PackagingId;
  quantity: number;
  title: string;
  merchant: string;
  image: string;
  discountPercent?: number;
}

export interface Merchant {
  companyName: string;
  bankInfo: string;
  managerPhone: string;
  brandName: string;
  brandLogo: string;
  shortIntro: string;
  addressBranches: string[];
  contactPhones: string[];
  facebook?: string;
  instagram?: string;
  email?: string;
  website?: string;
  workingHours?: string;
  gallery?: string[];
}

/** Paginated list from GET /api/gifts */
export interface GiftsListResponse {
  items: Gift[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Gift card detail as returned by API: gift + full merchant info for the modal */
export type GiftWithMerchant = Gift & { merchant: Merchant | null };

export type CheckoutSendOption = "now" | "scheduled";

export interface CheckoutPayload {
  slug: string;
  amount: number;
  senderName: string;
  receiverName: string;
  receiverEmail: string;
  /** Мэндчилгээний мессеж */
  message: string;
  /** Яг одоо эсвэл тодорхой цагт илгээх */
  sendOption?: CheckoutSendOption;
  /** sendOption === "scheduled" үед ISO 8601 */
  scheduledAt?: string;
  /** Захиалга баталгаажсаны дараа хүлээн авагчид SMS илгээх эсэх */
  notifyRecipientBySms?: boolean;
  /** SMS илгээх утасны дугаар (notifyRecipientBySms === true үед) */
  receiverPhone?: string;
}

export interface CheckoutResponse {
  orderId: string;
  redeemCode: string;
}
