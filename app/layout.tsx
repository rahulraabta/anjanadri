import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import FlyToCart from "@/components/FlyToCart";
import { Toaster } from "sonner";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CommandMenu from "@/components/CommandMenu";
import PageTransition from "@/components/PageTransition";
import MotionProvider from "@/components/MotionProvider";
import CustomCursor from "@/components/CustomCursor";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const BRAND = "Anjanadri Dehydrated Fruits & Vegetables";

export const metadata: Metadata = {
  icons: {
    icon: { url: "/images/logo3.png?v=2", type: "image/png" },
    shortcut: "/images/logo3.png?v=2",
    apple: "/images/logo3.png?v=2",
  },
  title: {
    default: `${BRAND} — 100% Natural, Dehydrated & Natural`,
    template: `%s | ${BRAND}`,
  },
  description:
    "Anjanadri Dehydrated Fruits & Vegetables from Mysore. 100% Natural, No Preservatives, Dehydrated & Natural. Sticky Banana best-seller at ₹190.",
  keywords: [
    "dehydrated fruits",
    "dried vegetables",
    "fruit chips",
    "healthy snacks",
    "no added sugar",
    "Anjanadri",
    "natural snacks",
    "organic dried fruit",
  ],
  openGraph: {
    title: `${BRAND} — Nature's Crunch, Preserved`,
    description:
      "Hand-selected fruits & vegetables, slow-dried at low temperatures. Zero additives. 100% natural crunch.",
    siteName: BRAND,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — Nature's Crunch, Preserved`,
    description:
      "Artisanal dehydrated fruits & vegetable crisps. Slow-dried to lock in natural flavor and nutrients. Shop now.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-[#FFF8E7] font-sans text-[#3E2723]">
        <MotionProvider>
          <CustomCursor />
          <CartProvider>
            <CommandMenu>
              <PageTransition>{children}</PageTransition>
              <CartDrawer />
              <FlyToCart />
            </CommandMenu>
          </CartProvider>
          <Toaster
            richColors
            theme="light"
            position="top-right"
            duration={3000}
            visibleToasts={3}
            closeButton
            className="brand-toaster"
          />
          <WhatsAppFloat />
        </MotionProvider>
      </body>
    </html>
  );
}
