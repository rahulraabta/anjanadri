import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-06-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export interface SanityProduct {
  // Sanity fields (optional for legacy compatibility)
  _id?: string;
  slug?: string;
  // Legacy fields (optional fallback)
  id?: string;
  tags?: string[];
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  // Core fields
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription?: string;
  image: any;
  category?: string;
  benefit?: string;
  badge?: string;
  weight?: string;
  inStock?: boolean;
}

// Helper: stable ID across both Sanity + legacy data
export function productKey(p: SanityProduct): string {
  return p._id ?? p.id ?? p.slug ?? p.name;
}

// Helper: stable URL slug
export function productSlug(p: SanityProduct): string {
  return p.slug ?? p.id ?? p.name.toLowerCase().replace(/\s+/g, '-');
}

export const PRODUCTS_QUERY = `*[_type == "product"] | order(name asc) {
  _id, name, "slug": slug.current, price, originalPrice,
  description, shortDescription, image, category, benefit,
  badge, weight, inStock
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, name, "slug": slug.current, price, originalPrice,
  description, shortDescription, image, category, benefit,
  badge, weight, inStock
}`;