"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products as fallbackProducts } from "@/data/products";

const FREE_SHIPPING_THRESHOLD = 499;

// WhatsApp is the final checkout destination — no payment gateway, no DB
// order tracking. Number defaults to the business contact published in the
// footer; override with NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, with
// country code, e.g. "919880106885").
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919880106885";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  const freeShippingDiff = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const lines = cart.map(
      (item) =>
        `\u2022 ${item.product.name} x ${item.quantity} — ₹${(item.product.price * item.quantity).toFixed(0)}`
    );
    const message = [
      "Hello Anjanadri! I would like to place an order:",
      "",
      ...lines,
      "",
      `Total: ₹${subtotal.toFixed(0)}`,
      "",
      "Name:",
      "Delivery address:",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener"
    );
    clearCart();
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#3E2723]/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[-20px_0_50px_rgba(62,39,35,0.15)] sm:border-l sm:border-[#F0E2C4]"
          >
            {/* Header */}
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

            {/* Free Shipping Tier Banner */}
            <div className="border-b border-[#F0E2C4] bg-[#FFF3D6] px-6 py-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#3E2723]">
                  {freeShippingDiff > 0 ? (
                    <>Add <strong className="text-[#F57C00]">₹{freeShippingDiff.toFixed(0)}</strong> for free shipping</>
                  ) : (
                    <span className="flex items-center gap-1.5 font-semibold text-[#2E7D32]">
                      <Sparkles className="h-3.5 w-3.5" /> You unlocked free shipping!
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium text-[#3E2723]/55">
                  ₹{subtotal.toFixed(0)} / ₹{FREE_SHIPPING_THRESHOLD}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F0E2C4]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] to-[#F57C00] transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                /* Empty Cart State */
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF3D6] text-[#3E2723]/55">
                    <ShoppingBag className="h-10 w-10 opacity-40" />
                  </div>
                  <h3 className="font-heading mt-4 text-xl font-semibold text-[#3E2723]">
                    Your basket is empty
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-[#3E2723]/55">
                    Discover our slow-dehydrated fruits and crisps crafted with 100% natural ingredients.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-[#3E2723] px-6 py-2.5 text-sm font-semibold text-[#FFF8E7] transition-all hover:bg-[#F57C00]"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                /* Item list */
                <ul className="divide-y divide-[#F0E2C4]">
                  {cart.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-4 py-4">
                      <Link
                        href={`/products/${product.id}`}
                        onClick={closeCart}
                        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#F0E2C4]"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${product.id}`}
                              onClick={closeCart}
                              className="font-heading text-base font-semibold text-[#3E2723] hover:text-[#C2410C] line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-[#3E2723]/55 hover:text-[#C2410C] transition-colors p-1"
                              aria-label={`Remove ${product.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-xs text-[#2E7D32] font-medium">{product.category}</span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[#F0E2C4] bg-[#FFF3D6] px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 text-[#3E2723]/55 hover:text-[#3E2723] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-[#3E2723]">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
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
                  ))}
                </ul>
              )}

              {/* Frequently Bought Together / Smart Cart Recommendations */}
              {cart.length > 0 && (
                <div className="mt-6 border-t border-[#F0E2C4] pt-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3E2723] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-[#C2410C]" />
                    <span>Frequently Paired With Your Basket</span>
                  </div>

                  <div className="space-y-2.5">
                    {(() => {
                      const cartIds = cart.map((c) => c.product.id);
                      // Collect complementary IDs from products in cart, or fallback to items not in cart
                      const potentialComplements = cart.flatMap((c) => c.product.complementaryIds || []);
                      const suggestions = fallbackProducts
                        .filter((p) => !cartIds.includes(p.id) && p.inStock)
                        .sort((a, b) => {
                          const aScore = potentialComplements.includes(a.id) ? 2 : 0;
                          const bScore = potentialComplements.includes(b.id) ? 2 : 0;
                          return bScore - aScore;
                        })
                        .slice(0, 2);

                      return suggestions.map((sug) => (
                        <div
                          key={sug.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0E2C4] bg-[#FFF3D6]/60 p-2.5 transition-all hover:bg-[#FFF3D6]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                              <Image
                                src={sug.image}
                                alt={sug.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-[#3E2723] line-clamp-1">
                                {sug.name}
                              </p>
                              <p className="text-[11px] font-semibold text-[#F57C00]">
                                ₹{sug.price.toFixed(0)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => addToCart(sug, 1)}
                            className="inline-flex items-center gap-1 rounded-full border border-[#F57C00]/40 bg-white px-3 py-1.5 text-[11px] font-bold text-[#C2410C] transition-all hover:bg-[#F57C00] hover:text-white shadow-xs"
                          >
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>


            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-[#F0E2C4] bg-[#FFF3D6] p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-[#3E2723]/55">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3E2723]">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#3E2723]/55">
                    <span>Shipping</span>
                    <span>{freeShippingDiff <= 0 ? "FREE" : "Calculated at step"}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#F0E2C4] pt-2 text-base font-semibold text-[#3E2723]">
                    <span>Estimated Total</span>
                    <span className="font-heading text-lg">₹{subtotal.toFixed(0)}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout}>
                  <button
                    type="submit"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1B5E20]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Place Order on WhatsApp
                  </button>
                </form>

                <p className="text-center text-[11px] text-[#3E2723]/55">
                  You&apos;ll confirm your order in WhatsApp • Free shipping over ₹499
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
