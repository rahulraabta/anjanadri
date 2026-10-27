import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <p role="status" className="sr-only">Loading products...</p>
        <div aria-busy="true" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
