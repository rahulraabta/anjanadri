import { cache } from 'react';
import { PRODUCTS_QUERY, type SanityProduct } from './sanity';
import { sanityFetch } from './sanity-fetch';
import { isSanityNetworkError } from './sanity-utils';

type PublishedProduct = SanityProduct & { _id: string; slug: string };
const REQUIRED_TEXT = ['_id', 'slug', 'name', 'description'];
const OPTIONAL_TEXT = ['shortDescription', 'category', 'benefit', 'badge', 'weight', 'imageBlurDataURL', 'imageDominantColor'];
const OPTIONAL_NUMBERS = ['originalPrice', 'rating', 'reviewCount', 'stock'];
const OPTIONAL_BOOLEANS = ['inStock', 'isBestSeller'];
const OPTIONAL_FIELDS = [...OPTIONAL_TEXT, ...OPTIONAL_NUMBERS, ...OPTIONAL_BOOLEANS, 'tags'];

/** Narrows unknown JSON to a plain record before validating individual CMS fields. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Checks normalized Sanity crop/hotspot coordinates before the image builder uses them. */
function validCoordinates(value: unknown, fields: string[]): boolean {
  return value === undefined || (isRecord(value) && fields.every(field => (
    typeof value[field] === 'number' && Number.isFinite(value[field]) &&
    value[field] >= 0 && value[field] <= 1
  )));
}

/**
 * Validates the published catalog at the CMS boundary, before process-local caching.
 * Required text, nonnegative finite prices, image references, and optional UI fields
 * are checked. Invalid content fails the build rather than silently publishing broken
 * products. Validation errors can use the fetch utility's last-known-good fallback.
 */
function parseProducts(data: unknown): PublishedProduct[] {
  if (!Array.isArray(data)) throw new Error('Sanity returned an invalid product catalog.');
  for (const product of data) {
    if (!isRecord(product)) throw new Error('Sanity returned an invalid product.');
    const image = product.image;
    const validImage = typeof image === 'string'
      ? image.length > 0
      : isRecord(image) && isRecord(image.asset) &&
        typeof image.asset._ref === 'string' && /^image-[a-z\d]+-\d+x\d+-[a-z\d]+$/i.test(image.asset._ref) &&
        validCoordinates(image.crop, ['left', 'right', 'top', 'bottom']) &&
        validCoordinates(image.hotspot, ['x', 'y', 'width', 'height']);
    if (
      REQUIRED_TEXT.some(field => typeof product[field] !== 'string' || !product[field].trim()) ||
      typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0 ||
      !validImage ||
      OPTIONAL_TEXT.some(field => product[field] != null && typeof product[field] !== 'string') ||
      OPTIONAL_NUMBERS.some(field => product[field] != null && (
        typeof product[field] !== 'number' || !Number.isFinite(product[field]) || product[field] < 0
      )) ||
      OPTIONAL_BOOLEANS.some(field => product[field] != null && typeof product[field] !== 'boolean') ||
      (product.tags != null && (!Array.isArray(product.tags) || product.tags.some(tag => typeof tag !== 'string')))
    ) {
      throw new Error('Sanity returned invalid product fields.');
    }
    for (const field of OPTIONAL_FIELDS) {
      if (product[field] === null) delete product[field];
    }
  }
  return data as PublishedProduct[];
}

/**
 * Loads the validated catalog from the Sanity origin, keeping pages and generated URLs
 * on the same query/cache policy. React deduplicates repeated calls within a render;
 * sanityFetch deduplicates network work across overlapping renders in one process.
 */
export const getProducts = cache(async (): Promise<PublishedProduct[]> => {
  try {
    return await sanityFetch(PRODUCTS_QUERY, {}, {
      useCdn: false,
      parse: parseProducts,
    });
  } catch (error) {
    if (!isSanityNetworkError(error)) throw error;
    console.warn('Failed to fetch products after retries; using an empty catalog.');
    return [];
  }
});

/** Finds a published product locally; metadata and page rendering need no second query. */
export const getProductBySlug = cache(async (slug: string): Promise<PublishedProduct | null> => {
  const products = await getProducts();
  return products.find(product => product.slug === slug) ?? null;
});

/** Returns the exact catalog slugs used by both static route generation and the sitemap. */
export async function getProductSlugs(): Promise<Array<{ slug: string }>> {
  return (await getProducts()).map(({ slug }) => ({ slug }));
}
