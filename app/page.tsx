import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import ProductGrid from "@/components/ProductGrid";
import DehydrationScience from "@/components/DehydrationScience";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <OurStory />
        <ProductGrid />
        <DehydrationScience />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
