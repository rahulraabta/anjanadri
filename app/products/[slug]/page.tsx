import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getAllProducts, getProductBySlug } from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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
      priceCurrency: "INR",
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

