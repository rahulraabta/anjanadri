import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Order via WhatsApp",
  description:
    "Review your artisanal basket of dehydrated fruits and crisps, enter your delivery address, and place your order directly via WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-[85vh] bg-[#FFF8E7]">
        <CheckoutForm />
      </main>
      <Footer />
    </>
  );
}
