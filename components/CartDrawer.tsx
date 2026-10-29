"use client";

import { useEffect, useEffectEvent, useRef, useSyncExternalStore } from "react";
import { m, useDragControls, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import MagneticButton from "@/components/MagneticButton";
import MotionProvider from "@/components/MotionProvider";
import { type SanityProduct, urlFor, productKey, productSlug } from "@/lib/sanity";

const DESKTOP_QUERY = "(min-width: 48rem)";

const subscribeToDesktop = (callback: () => void) => {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const imgUrl = (img: SanityProduct["image"], w = 160) =>
  typeof img === "string" ? img : urlFor(img).width(w).url();

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  const dragControls = useDragControls();
  const reducedMotion = useReducedMotion();
  const dismissCart = useEffectEvent(() => closeCart());

  useEffect(() => {
    if (!isCartOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissCart();
      }
      if (event.key !== "Tab") return;

      const controls = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) {
        event.preventDefault();
        drawer.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === drawer)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <MotionProvider extended>
      <div
        inert={!isCartOpen}
        aria-hidden={!isCartOpen}
        className={`fixed inset-0 z-[60] transition-[visibility] duration-0 ${isCartOpen ? "visible" : "invisible delay-300"}`}
      >
            <div
              aria-hidden="true"
              onClick={closeCart}
              className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${isCartOpen ? "opacity-100" : "opacity-0"}`}
            />

            <m.div
              ref={drawerRef}
              id="cart-drawer"
              role="dialog"
              aria-modal={isCartOpen || undefined}
              aria-labelledby="cart-drawer-title"
              tabIndex={-1}
              initial={false}
              animate={{
                x: isDesktop && !isCartOpen ? "100%" : 0,
                y: !isDesktop && !isCartOpen ? "100%" : 0,
              }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeInOut" }}
              drag={!isDesktop && isCartOpen ? "y" : false}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (!isDesktop && (info.offset.y > 100 || info.velocity.y > 500)) {
                  closeCart();
                }
              }}
              className="fixed inset-x-0 bottom-0 flex h-[80dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[-20px_0_50px_rgba(62,39,35,0.15)] md:inset-x-auto md:inset-y-0 md:right-0 md:h-full md:max-w-md md:rounded-none md:border-l md:border-[#F0E2C4]"
            >
              <div
                aria-hidden="true"
                onPointerDown={(event) => {
                  if (!isDesktop && isCartOpen) dragControls.start(event);
                }}
                className="flex h-8 shrink-0 touch-none items-center justify-center md:hidden"
              >
                <div className="h-1.5 w-12 rounded-full bg-gray-300" />
              </div>
              <div className="flex shrink-0 items-center justify-between border-b border-[#F0E2C4] px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32]">
                    <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <h2 id="cart-drawer-title" className="font-heading text-xl font-semibold text-[#3E2723]">
                      Your Cart
                    </h2>
                    <p className="text-xs text-[#3E2723]/55">
                      {totalItems} {totalItems === 1 ? "item" : "items"} selected
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-[#3E2723]/55 transition-colors hover:bg-[#F0E2C4] hover:text-[#3E2723]"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <ShoppingBag size={48} color="#3E2723" className="opacity-40" />
                    <h3 className="font-heading text-xl font-bold text-[#3E2723] mt-4">
                      Your cart is empty
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
                              loading="lazy"
                              className="object-cover transition-transform hover:scale-105"
                              unoptimized
                            />
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col justify-between">
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

                <div className="sticky bottom-0 shrink-0 border-t border-[#F0E2C4] bg-[#FFF3D6] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-[#3E2723]/55">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#3E2723]">₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#3E2723]/55">
                      <span>Shipping</span>
                      <span>Calculated on WhatsApp</span>
                    </div>
                    <div className="flex justify-between border-t border-[#F0E2C4] pt-2 text-base font-semibold text-[#3E2723]">
                      <span>Estimated Total</span>
                      <span className="font-heading text-lg">₹{subtotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <MagneticButton
                    type="button"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] py-3.5 text-base font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-[#1B5E20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </MagneticButton>

                  <p className="text-center text-[11px] text-[#3E2723]/55">
                    Enter delivery details &amp; order via WhatsApp
                  </p>
                </div>
            </m.div>
      </div>
    </MotionProvider>
  );
}
