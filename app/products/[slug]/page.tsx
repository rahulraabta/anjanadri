import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import {
  getComplementaryProducts,
  productKey,
  productSlug,
  urlFor,
} from "@/lib/sanity";
import { getProductBySlug, getProducts, getProductSlugs } from "@/lib/sanity-products";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Generates only published catalog URLs; CMS failures abort rather than omit routes. */
export async function generateStaticParams() {
  return getProductSlugs();
}

/** Reuses the catalog lookup for metadata without another CMS request. */
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
    description: product.shortDescription ?? product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
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
        ? absoluteUrl(product.image)
        : urlFor(product.image).width(1200).height(1200).url(),
    description: product.description,
    sku: product._id ?? product.slug ?? productSlug(product),
    brand: {
      "@type": "Brand",
      name: "Anjanadri Dehydrated Fruits & Vegetables",
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${productSlug(product)}`),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Navbar />
      <main className="flex-1">
        <ProductDetailClient product={product} allProducts={getComplementaryProducts(product, allProducts)} />
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
      <div aria-hidden="true" className="h-[calc(5rem_+_env(safe-area-inset-bottom))] md:hidden" />
    </>
  );
}

