export interface SearchHit {
  id: string;
  title: string;
  slug: string;
  merchant: string;
  category: string;
  occasion: string[];
  location: string;
  priceOptions: number[];
  image: string;
  description: string;
}
