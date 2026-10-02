import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { products } from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
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

  const sameCategory = allProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const otherProducts = allProducts.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  const related = [...sameCategory, ...otherProducts].slice(0, 4);

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
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1">
        <ProductDetailClient product={product} allProducts={allProducts} />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2E7D32] mb-6 mt-16">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

