export interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  tags: string[];
  isBestSeller: boolean;
}
