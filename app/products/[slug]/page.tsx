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

async function getAllProducts(): Promise<Product[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, description, short_description, price, original_price, 
             category, image_url, stock, rating, review_count, weight, tags
      FROM products
      ORDER BY id ASC;
    `;
    if (rows.length > 0) {
      return rows.map((r: any) => {
        const fallback = fallbackProducts.find((p) => p.id === r.id);
        const stockNum = r.stock !== undefined && r.stock !== null ? parseInt(r.stock) : (fallback?.stock ?? 15);
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
          inStock: stockNum > 0,
          stock: stockNum,
          weight: r.weight || "2.5 oz (70g)",
          tags: Array.isArray(r.tags) ? r.tags : (fallback?.tags || ["100% Natural"]),
          flavorProfile: fallback?.flavorProfile,
          snackOccasion: fallback?.snackOccasion,
          complementaryIds: fallback?.complementaryIds,
          nutrients: fallback?.nutrients,
        };
      });
    }
  } catch (err) {
    // fallback
  }
  return fallbackProducts;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const all = await getAllProducts();
  const product = all.find((p) => p.id === slug);

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
  const allProducts = await getAllProducts();
  const product = allProducts.find((p) => p.id === slug);

  if (!product) {
    notFound();
  }

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

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
        <ProductDetailClient product={product} relatedProducts={related} allProducts={allProducts} />
      </main>
      <Footer />
    </>
  );
}

