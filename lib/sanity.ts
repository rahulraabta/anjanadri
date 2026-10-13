import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: 'na9vam30',
  dataset: 'production',
  apiVersion: '2026-06-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export interface SanityProduct {
  _id?: string;
  slug?: string;
  id?: string;
  tags?: string[];
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
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

export function productKey(p: SanityProduct): string {
  return p._id ?? p.id ?? p.slug ?? p.name;
}

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