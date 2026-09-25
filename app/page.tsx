import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FFF8E7]">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
