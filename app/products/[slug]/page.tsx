import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import {
  client,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_QUERY,
  productKey,
  productSlug,
  urlFor,
  type SanityProduct,
} from "@/lib/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch<SanityProduct | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug }
  );

  if (!product) {
    return {
      title: "Product Not Found | Anjanadri Dehydrated Fruits & Vegetables",
    };
  }

  return {
    title: `${product.name} — Anjanadri Dehydrated Fruits & Vegetables`,
    description: product.shortDescription ?? product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    client.fetch<SanityProduct | null>(PRODUCT_BY_SLUG_QUERY, { slug }),
    client.fetch<SanityProduct[]>(PRODUCTS_QUERY),
  ]);

  if (!product) {
    notFound();
  }

  const sameCategory = allProducts.filter(
    (p) => productKey(p) !== productKey(product) && p.category === product.category
  );
  const otherProducts = allProducts.filter(
    (p) => productKey(p) !== productKey(product) && p.category !== product.category
  );
  const related = [...sameCategory, ...otherProducts].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image:
      typeof product.image === "string"
        ? `https://anjanadri.pages.dev${product.image}`
        : urlFor(product.image).width(1200).height(1200).url(),
    description: product.description,
    sku: product._id ?? product.slug ?? productSlug(product),
    brand: {
      "@type": "Brand",
      name: "Anjanadri Dehydrated Fruits & Vegetables",
    },
    offers: {
      "@type": "Offer",
      url: `https://anjanadri.pages.dev/products/${productSlug(product)}`,
      priceCurrency: "INR",
      price: product.price.toString(),
      availability:
        product.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Anjanadri Dehydrated Fruits & Vegetables",
      },
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
              <ProductCard key={productKey(p)} product={p} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

