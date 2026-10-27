import { getProducts } from "@/lib/sanity-products";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import PartnerDashboard from "@/components/PartnerDashboard";
import Footer from "@/components/Footer";

export const dynamic = "force-static";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <Hero products={products} />
      <main className="border-t border-[#F0E2C4] bg-[#FFF8E7] py-12 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="min-w-0 lg:col-span-3">
            <ProductGrid products={products} />
          </div>
          <div className="min-w-0 break-words lg:col-span-1">
            <div className="sticky top-24">
              <PartnerDashboard />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
