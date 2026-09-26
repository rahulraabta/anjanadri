import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products as fallbackProducts, type Product } from "@/data/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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
      const r = rows[0];
      const fallback = fallbackProducts.find((p) => p.id === slug);
      const product: Product = {
        id: r.id,
        name: r.name,
        description: r.description,
        shortDescription: r.short_description || r.description.slice(0, 80) + "...",
        price: parseFloat(r.price),
        originalPrice: r.original_price ? parseFloat(r.original_price) : undefined,
        category: r.category,
        image: r.image_url,
        rating: parseFloat(r.rating) || 5.0,
        reviewCount: r.review_count || 120,
        inStock: (r.stock ?? 1) > 0,
        weight: r.weight || "2.5 oz (70g)",
        tags: Array.isArray(r.tags) ? r.tags : ["100% Natural", "No Preservatives"],
        benefit: fallback?.benefit ?? "",
        badge: fallback?.badge,
      };
      return NextResponse.json({ product, source: "neon" });
    }
  } catch (err) {
    console.error("Failed to fetch product by slug from Neon:", err);
  }

  // Fallback
  const found = fallbackProducts.find((p) => p.id === slug);
  if (found) {
    return NextResponse.json({ product: found, source: "fallback" });
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}
