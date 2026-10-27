import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

export const SANITY_REQUEST_TIMEOUT_MS = 5000;

export const client = createClient({
  projectId: 'na9vam30',
  dataset: 'production',
  apiVersion: '2026-06-01',
  useCdn: true,
  timeout: SANITY_REQUEST_TIMEOUT_MS,
  maxRetries: 0,
});

const builder = createImageUrlBuilder(client);

/**
 * Builds a Sanity CDN image URL without issuing a network request.
 * @param source A typed Sanity image, asset reference, or asset ID.
 * @returns A chainable builder for sizing, cropping, and format selection.
 */
export function urlFor(source: SanityImageSource) {
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
  image: SanityImageSource;
  imageBlurDataURL?: string;
  imageDominantColor?: string;
  category?: string;
  benefit?: string;
  badge?: string;
  weight?: string;
  inStock?: boolean;
}

/** Returns the CMS identity, retaining legacy ID/name fallbacks for stored carts. */
export function productKey(product: SanityProduct): string {
  return product._id ?? product.id ?? product.slug ?? product.name;
}

/** Returns the published URL slug, with legacy fallbacks for stored cart items. */
export function productSlug(product: SanityProduct): string {
  return product.slug ?? product.id ?? product.name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Selects at most two bundle candidates in catalog order, excluding the current item.
 * Explicit complementary IDs qualify first; otherwise candidates must be available
 * and from a different category. Shared by server payload selection and client UI so
 * product pages never need to hydrate the entire catalog just to render a bundle.
 */
export function getComplementaryProducts(
  currentProduct: SanityProduct & { complementaryIds?: string[] },
  products: SanityProduct[],
): SanityProduct[] {
  return products.filter(product => {
    if (productKey(product) === productKey(currentProduct)) return false;
    return currentProduct.complementaryIds?.includes(productKey(product)) ||
      (product.category !== currentProduct.category && product.inStock);
  }).slice(0, 2);
}

const PRODUCT_FIELDS = `
  _id, name, "slug": slug.current, price, originalPrice,
  description, shortDescription, image, category, benefit,
  "imageBlurDataURL": image.asset->metadata.lqip,
  "imageDominantColor": image.asset->metadata.palette.dominant.background,
  badge, weight, inStock, tags, isBestSeller, rating, reviewCount, stock
`;

export const PRODUCTS_QUERY = `*[_type == "product" && defined(slug.current)] | order(name asc) {
  ${PRODUCT_FIELDS}
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  ${PRODUCT_FIELDS}
}`;
