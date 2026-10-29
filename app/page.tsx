import { getProducts } from "@/lib/sanity-products";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import ProductGrid from "@/components/ProductGrid";
import PartnerDashboard from "@/components/PartnerDashboard";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import StickyStack from "@/components/StickyStack";

export const dynamic = "force-static";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main>
        <StickyStack>
          <div>
            <Hero products={products} />
            <InfiniteMarquee />
          </div>
          <div className="border-t border-[#F0E2C4] bg-[#FFF8E7] py-12 lg:py-20">
            <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
              <ProductGrid products={products} />
            </div>
          </div>
          <div className="border-t border-[#F0E2C4] bg-[#FFF8E7] py-12 lg:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <ScrollReveal><PartnerDashboard /></ScrollReveal>
            </div>
          </div>
        </StickyStack>
      </main>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </>
  );
}
