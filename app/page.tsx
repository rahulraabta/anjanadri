import { client, PRODUCTS_QUERY, SanityProduct } from "@/lib/sanity";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export const dynamic = "force-static";

export default async function Home() {
  const products = await client.fetch<SanityProduct[]>(PRODUCTS_QUERY);

  return (
    <>
      <Navbar />
      <Hero products={products} />
      <ProductGrid products={products} />
      <Footer />
    </>
  );
}