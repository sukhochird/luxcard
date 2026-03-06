/**
 * One-off script: appends dummy gift cards to data/gifts.json until total is 500.
 * Run: node scripts/generate-gift-dummy-data.js
 */

const fs = require("fs");
const path = require("path");

const CATEGORIES = [
  "Restaurant",
  "Coffee Shop",
  "Beauty & Spa",
  "Fitness",
  "Entertainment",
  "Hotel",
  "Travel",
  "Retail",
];

const OCCASIONS = [
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
];

const LOCATIONS = ["Ulaanbaatar", "Darkhan", "Erdenet"];

const MERCHANT_PREFIXES = {
  Restaurant: ["Dining", "Bistro", "Kitchen", "Table", "Grill", "Veranda", "Ger", "Steppe", "Nomad", "Sky"],
  "Coffee Shop": ["Coffee", "Brew", "Bean", "Café", "Espresso", "Roast", "Mocha", "Latte", "Cuppa"],
  "Beauty & Spa": ["Spa", "Beauty", "Zen", "Serenity", "Glow", "Bliss", "Lotus", "Mandal", "Pure"],
  Fitness: ["Fitness", "Gym", "Power", "Peak", "Core", "Flex", "Iron", "Active", "Fit"],
  Entertainment: ["Kino", "Theatre", "Stage", "Screen", "Play", "Show", "Arcade", "Fun"],
  Hotel: ["Hotel", "Inn", "Resort", "Lodge", "Suite", "Grand", "Plaza", "Sky"],
  Travel: ["Tours", "Nomads", "Steppe", "Gobi", "Adventures", "Trails", "Explore", "Journey"],
  Retail: ["Store", "Market", "Shop", "Mall", "Department", "Boutique", "Gallery"],
};

const IMAGES_BY_CATEGORY = {
  Restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "Coffee Shop": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  "Beauty & Spa": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  Fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  Entertainment: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
  Hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  Travel: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
  Retail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
};

const PRICE_TEMPLATES = [
  [25000, 50000],
  [30000, 60000],
  [40000, 80000],
  [50000, 100000],
  [50000, 100000, 200000],
  [60000, 120000],
  [75000, 150000],
  [80000, 120000, 180000],
  [100000, 200000],
  [100000, 200000, 350000],
  [150000, 250000, 400000],
  [180000, 300000, 500000],
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function pick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateGift(id, index) {
  const category = CATEGORIES[index % CATEGORIES.length];
  const location = LOCATIONS[index % LOCATIONS.length];
  const prefixes = MERCHANT_PREFIXES[category];
  const namePart = prefixes[index % prefixes.length];
  const suffix = index + 1;
  const merchant = `${namePart} ${location} ${suffix}`.trim();
  const slug = slugify(`${namePart}-${location}-${suffix}`);
  const title = `${merchant} Gift Card`;
  const occasionCount = 2 + (index % 4);
  const occasion = pick(OCCASIONS, occasionCount);
  const priceOptions = PRICE_TEMPLATES[index % PRICE_TEMPLATES.length];
  const featured = index % 5 === 0;
  const image = IMAGES_BY_CATEGORY[category];
  const discountPercent = featured && index % 3 === 0 ? (5 + (index % 3) * 5) : undefined;
  const descriptions = {
    Restaurant: "Dining experience and quality cuisine.",
    "Coffee Shop": "Specialty coffee and light refreshments.",
    "Beauty & Spa": "Spa treatments and wellness services.",
    Fitness: "Gym access and fitness classes.",
    Entertainment: "Tickets and entertainment experiences.",
    Hotel: "Stay or dining credit.",
    Travel: "Tours and travel experiences.",
    Retail: "Shopping credit across departments.",
  };
  const description = descriptions[category];

  return {
    id: String(id),
    slug,
    title,
    merchant,
    category,
    occasion,
    location,
    priceOptions: [...priceOptions],
    featured,
    image,
    description,
    ...(discountPercent != null && { discountPercent }),
  };
}

const dataPath = path.join(__dirname, "..", "data", "gifts.json");
const existing = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const currentCount = existing.length;
const targetCount = 500;
const toAdd = targetCount - currentCount;

if (toAdd <= 0) {
  console.log(`Already have ${currentCount} gift cards. No change.`);
  process.exit(0);
}

const newGifts = [];
for (let i = 0; i < toAdd; i++) {
  const id = currentCount + i + 1;
  newGifts.push(generateGift(id, currentCount + i));
}

const combined = [...existing, ...newGifts];
fs.writeFileSync(dataPath, JSON.stringify(combined, null, 2), "utf8");
console.log(`Added ${toAdd} gift cards. Total: ${combined.length}.`);