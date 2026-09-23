import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products as fallbackProducts, type Product } from "@/data/products";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, description, short_description, price, original_price, 
             category, image_url, stock, rating, review_count, weight, tags
      FROM products
      ORDER BY id ASC;
    `;

    const mappedProducts: Product[] = rows.map((r: any) => ({
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
    }));

    return NextResponse.json({ products: mappedProducts, source: "neon" });
  } catch (err: any) {
    console.error("Failed to fetch products from Neon, using fallback data:", err);
    return NextResponse.json({ products: fallbackProducts, source: "fallback" });
  }
}
