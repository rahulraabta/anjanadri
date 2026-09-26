import { cache } from "react";
import { getDb } from "@/lib/db";
import { products as fallbackProducts, type Product } from "@/data/products";

/** Shared Neon row -> Product mapper. `fallback` fills the local-only fields
 *  (nutrients, flavour profile, complementary ids) the DB does not store. */
export function mapProductRow(row: any, fallback?: Product): Product {
  const stockRaw = row.stock !== undefined && row.stock !== null ? parseInt(row.stock) : undefined;
  const stock = stockRaw ?? fallback?.stock ?? 15;
  const ratingRaw = row.rating !== undefined && row.rating !== null ? parseFloat(row.rating) : NaN;
  const description: string = row.description ?? fallback?.description ?? "";

  return {
    id: row.id,
    name: row.name,
    description,
    shortDescription: row.short_description || fallback?.shortDescription || description.slice(0, 80) + "...",
    price: parseFloat(row.price),
    originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
    category: row.category,
    image: row.image_url,
    rating: Number.isFinite(ratingRaw) ? ratingRaw : (fallback?.rating ?? 5.0),
    reviewCount: row.review_count ?? fallback?.reviewCount ?? 120,
    inStock: stock > 0,
    stock,
    isBestSeller: fallback?.isBestSeller,
    weight: row.weight || fallback?.weight || "200g",
    tags: Array.isArray(row.tags)
      ? row.tags
      : fallback?.tags ?? ["100% Natural", "No Preservatives"],
    flavorProfile: fallback?.flavorProfile,
    snackOccasion: fallback?.snackOccasion,
    complementaryIds: fallback?.complementaryIds,
    nutrients: fallback?.nutrients,
    benefit: fallback?.benefit ?? "",
    badge: fallback?.badge,
  };
}

/** Neon is an optional overlay: if it is missing or unhappy we serve the local
 *  catalogue rather than failing the request. Cached per request, so
 *  generateMetadata and the page share one query. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, description, short_description, price, original_price,
             category, image_url, stock, rating, review_count, weight, tags
      FROM products
      ORDER BY id ASC;
    `;
    if (rows.length > 0) {
      return rows.map((row: any) =>
        mapProductRow(row, fallbackProducts.find((p) => p.id === row.id))
      );
    }
  } catch (err) {
    console.error("Failed to fetch products from Neon, using local catalogue:", err);
  }
  return fallbackProducts;
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT id, name, description, short_description, price, original_price,
               category, image_url, stock, rating, review_count, weight, tags
        FROM products
        WHERE id = ${slug}
        LIMIT 1;
      `;
      if (rows.length > 0) {
        return mapProductRow(rows[0], fallbackProducts.find((p) => p.id === slug));
      }
    } catch (err) {
      console.error("Failed to fetch product from Neon, using local catalogue:", err);
    }
    return fallbackProducts.find((p) => p.id === slug);
  }
);
