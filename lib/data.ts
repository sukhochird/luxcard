export const OCCASIONS = [
  "Birthday",
  "Wedding",
  "Holiday",
  "New Year",
  "Valentine's",
  "Corporate",
  "Graduation",
  "Lunar New Year",
  "Mother's Day",
  "Father's Day",
  "Housewarming",
  "Baby Shower",
  "Thank You",
  "Get Well Soon",
  "Congratulations",
] as const;

export const CATEGORIES = [
  "Restaurant",
  "Coffee Shop",
  "Beauty & Spa",
  "Fitness",
  "Entertainment",
  "Hotel",
  "Travel",
  "Retail",
] as const;

export const PRICE_RANGES = [
  { label: "25,000₮ – 50,000₮", min: 25000, max: 50000 },
  { label: "50,000₮ – 100,000₮", min: 50000, max: 100000 },
  { label: "100,000₮+", min: 100000, max: null },
] as const;

export const LOCATIONS = [
  "Ulaanbaatar",
  "Darkhan",
  "Erdenet",
  "All Mongolia",
] as const;

export type Occasion = (typeof OCCASIONS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Location = (typeof LOCATIONS)[number];

export interface GiftCardItem {
  id: string;
  merchant: string;
  category: Category;
  occasion: Occasion[];
  price: number;
  location: Location;
  image: string;
  description: string;
  featured?: boolean;
}

export const MOCK_GIFT_CARDS: GiftCardItem[] = [
  {
    id: "1",
    merchant: "Veranda Restaurant",
    category: "Restaurant",
    occasion: ["Birthday", "Corporate"],
    price: 75000,
    location: "Ulaanbaatar",
    image: "/placeholder-restaurant.jpg",
    description: "Upscale Mongolian and international cuisine in Sukhbaatar Square.",
    featured: true,
  },
  {
    id: "2",
    merchant: "Blue Moon Coffee",
    category: "Coffee Shop",
    occasion: ["Birthday", "Valentine's"],
    price: 35000,
    location: "Ulaanbaatar",
    image: "/placeholder-coffee.jpg",
    description: "Specialty coffee and pastries in the heart of the city.",
    featured: true,
  },
  {
    id: "3",
    merchant: "Mandala Spa",
    category: "Beauty & Spa",
    occasion: ["Valentine's", "Holiday"],
    price: 120000,
    location: "Ulaanbaatar",
    image: "/placeholder-spa.jpg",
    description: "Full-day spa and massage experiences.",
    featured: true,
  },
  {
    id: "4",
    merchant: "Sky Fitness",
    category: "Fitness",
    occasion: ["New Year", "Corporate"],
    price: 50000,
    location: "Ulaanbaatar",
    image: "/placeholder-fitness.jpg",
    description: "Month-long gym and class access.",
    featured: false,
  },
  {
    id: "5",
    merchant: "Khan Kino",
    category: "Entertainment",
    occasion: ["Birthday", "Graduation"],
    price: 30000,
    location: "Ulaanbaatar",
    image: "/placeholder-cinema.jpg",
    description: "Movie tickets and concessions for two.",
    featured: false,
  },
  {
    id: "6",
    merchant: "Shangri-La Ulaanbaatar",
    category: "Hotel",
    occasion: ["Wedding", "Holiday"],
    price: 150000,
    location: "Ulaanbaatar",
    image: "/placeholder-hotel.jpg",
    description: "One-night stay or dining credit.",
    featured: true,
  },
  {
    id: "7",
    merchant: "Gobi Nomads Tours",
    category: "Travel",
    occasion: ["Holiday", "New Year"],
    price: 200000,
    location: "All Mongolia",
    image: "/placeholder-travel.jpg",
    description: "Day trip or experience credit toward tours.",
    featured: false,
  },
  {
    id: "8",
    merchant: "State Department Store",
    category: "Retail",
    occasion: ["Corporate", "Graduation"],
    price: 45000,
    location: "Ulaanbaatar",
    image: "/placeholder-retail.jpg",
    description: "Gift card for shopping across departments.",
    featured: false,
  },
  {
    id: "9",
    merchant: "Modern Nomads",
    category: "Restaurant",
    occasion: ["Wedding", "Corporate"],
    price: 95000,
    location: "Ulaanbaatar",
    image: "/placeholder-restaurant-2.jpg",
    description: "Fine dining with traditional and fusion dishes.",
    featured: false,
  },
  {
    id: "10",
    merchant: "Erdenet Beauty House",
    category: "Beauty & Spa",
    occasion: ["Birthday", "Valentine's"],
    price: 55000,
    location: "Erdenet",
    image: "/placeholder-beauty.jpg",
    description: "Hair, nails, and facial treatments.",
    featured: false,
  },
  {
    id: "11",
    merchant: "Darkhan Café",
    category: "Coffee Shop",
    occasion: ["Graduation", "New Year"],
    price: 28000,
    location: "Darkhan",
    image: "/placeholder-cafe.jpg",
    description: "Coffee and light meals in Darkhan city center.",
    featured: false,
  },
  {
    id: "12",
    merchant: "Terelj Resort",
    category: "Hotel",
    occasion: ["Holiday", "Wedding"],
    price: 180000,
    location: "Ulaanbaatar",
    image: "/placeholder-resort.jpg",
    description: "Resort stay or activity package near Ulaanbaatar.",
    featured: true,
  },
];

export const POPULAR_OCCASIONS = [
  { name: "Birthday", slug: "birthday", count: 24 },
  { name: "Wedding", slug: "wedding", count: 12 },
  { name: "New Year", slug: "new-year", count: 18 },
  { name: "Corporate", slug: "corporate", count: 15 },
  { name: "Valentine's", slug: "valentines", count: 10 },
  { name: "Graduation", slug: "graduation", count: 8 },
];
