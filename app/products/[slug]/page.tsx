import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getDb } from "@/lib/db";
import { products as fallbackProducts, type Product } from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
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
      return {
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
      };
    }
  } catch (err) {
    console.error("Neon fetch error for slug", slug, err);
  }

  const fallback = fallbackProducts.find((p) => p.id === slug);
  return fallback || null;
}

async function getRelatedProducts(currentId: string, category: string): Promise<Product[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, description, short_description, price, original_price, 
             category, image_url, stock, rating, review_count, weight, tags
      FROM products
      WHERE id != ${currentId} AND category = ${category}
      LIMIT 3;
    `;
    if (rows.length > 0) {
      return rows.map((r: any) => ({
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
        tags: Array.isArray(r.tags) ? r.tags : ["100% Natural"],
      }));
    }
  } catch (e) {
    // fallback
  }

  return fallbackProducts
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, 3);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Anjanadri Dehydrated Fruits & Vegetables",
    };
  }

  return {
    title: `${product.name} — Anjanadri Dehydrated Fruits & Vegetables`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.id, product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: "Anjanadri" },
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://anjanadri.com/products/${product.id}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1">
        <ProductDetailClient product={product} relatedProducts={related} />
      </main>
      <Footer />
    </>
  );
}
