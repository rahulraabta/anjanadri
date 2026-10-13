"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { urlFor, productKey, productSlug } from "@/lib/sanity";

const FREE_SHIPPING_THRESHOLD = 499;

const imgUrl = (img: any, w = 160) =>
  typeof img === "string" ? img : urlFor(img).width(w).url();

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const freeShippingDiff = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#3E2723]/40 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[-20px_0_50px_rgba(62,39,35,0.15)] sm:border-l sm:border-[#F0E2C4]"
          >
            <div className="flex items-center justify-between border-b border-[#F0E2C4] px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32]">
                  <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-[#3E2723]">
                    Artisanal Basket
                  </h2>
                  <p className="text-xs text-[#3E2723]/55">
                    {totalItems} {totalItems === 1 ? "item" : "items"} selected
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-[#3E2723]/55 transition-colors hover:bg-[#F0E2C4] hover:text-[#3E2723]"
                aria-label="Close basket"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length > 0 && (
              <div className="border-b border-[#F0E2C4] bg-[#FFF3D6] px-6 py-3.5">
                {freeShippingDiff > 0 ? (
                  <p className="text-xs font-semibold text-[#3E2723]">
                    Add ₹{freeShippingDiff.toFixed(0)} for free shipping
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-[#2E7D32]">
                    ✓ You&apos;ve unlocked free shipping!
                  </p>
                )}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F0E2C4]">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ease-out ${freeShippingDiff > 0 ? "bg-[#2E7D32]" : "bg-[#F57C00]"}`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <ShoppingBag size={48} color="#3E2723" className="opacity-40" />
                  <h3 className="font-heading text-xl font-bold text-[#3E2723] mt-4">
                    Your basket is empty
                  </h3>
                  <p className="text-sm text-[#3E2723]/70 mt-2 text-center">
                    Add some dehydrated goodness to get started.
                  </p>
                  <Link
                    href="/#shop"
                    onClick={closeCart}
                    className="mt-6 bg-[#F57C00] text-white font-bold py-3 px-6 rounded-full"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-[#F0E2C4]">
                  {cart.map(({ product, quantity }) => {
                    const key = productKey(product);
                    const slug = productSlug(product);
                    return (
                      <li key={key} className="flex gap-4 py-4">
                        <Link
                          href={`/products/${slug}`}
                          onClick={closeCart}
                          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#F0E2C4]"
                        >
                          <Image
                            src={imgUrl(product.image, 160)}
                            alt={product.name}
                            fill
                            sizes="80px"
                            className="object-cover transition-transform hover:scale-105"
                            unoptimized
                          />
                        </Link>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/products/${slug}`}
                                onClick={closeCart}
                                className="font-heading text-base font-semibold text-[#3E2723] hover:text-[#C2410C] line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <button
                                onClick={() => removeFromCart(key)}
                                className="text-[#3E2723]/55 hover:text-[#C2410C] transition-colors p-1"
                                aria-label={`Remove ${product.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {product.category && (
                              <span className="text-xs text-[#2E7D32] font-medium">{product.category}</span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-[#F0E2C4] bg-[#FFF3D6] px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(key, quantity - 1)}
                                className="p-1 text-[#3E2723]/55 hover:text-[#3E2723] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-semibold text-[#3E2723]">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(key, quantity + 1)}
                                className="p-1 text-[#3E2723]/55 hover:text-[#3E2723] transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-heading text-base font-semibold text-[#3E2723]">
                              ₹{(product.price * quantity).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#F0E2C4] bg-[#FFF3D6] p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-[#3E2723]/55">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3E2723]">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#3E2723]/55">
                    <span>Shipping</span>
                    <span>{freeShippingDiff <= 0 ? "FREE" : "Calculated on WhatsApp"}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#F0E2C4] pt-2 text-base font-semibold text-[#3E2723]">
                    <span>Estimated Total</span>
                    <span className="font-heading text-lg">₹{subtotal.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1B5E20]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <p className="text-center text-[11px] text-[#3E2723]/55">
                  Enter delivery details &amp; order via WhatsApp • Free shipping over ₹499
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}