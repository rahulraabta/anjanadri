"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  User,
  Phone,
  FileText,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 499;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919880106885";
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;
const NOTES_MAX_LENGTH = 200;

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  notes?: string;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, subtotal, totalItems, updateQuantity, removeFromCart, clearCart, isLoaded, showToast } =
    useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    itemsCount: number;
    totalAmount: number;
    whatsappUrl: string;
  } | null>(null);

  // Handle empty cart redirect
  useEffect(() => {
    if (isLoaded && cart.length === 0 && !orderSubmitted) {
      showToast("Your basket is empty.");
      router.replace("/#shop");
    }
  }, [isLoaded, cart.length, orderSubmitted, router, showToast]);

  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const freeShippingDiff = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (at least 2 characters).";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.";
    }

    if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter your full delivery address (at least 10 characters).";
    }

    const cleanPincode = formData.pincode.replace(/\D/g, "");
    if (!PINCODE_REGEX.test(cleanPincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    if (formData.notes.trim().length > NOTES_MAX_LENGTH) {
      newErrors.notes = `Order notes must be ${NOTES_MAX_LENGTH} characters or fewer.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast("Please fill in the required delivery fields.");
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Build the WhatsApp message
    const orderLines = cart.map(
      (item) =>
        `• *${item.product.name}*${item.product.weight ? ` (${item.product.weight})` : ""} x ${item.quantity} — ₹${(
          item.product.price * item.quantity
        ).toFixed(0)}`
    );

    const messageLines = [
      "🌿 *NEW ORDER — ANJANADRI ARTISANAL FOODS* 🌿",
      "",
      "📍 *DELIVERY DETAILS:*",
      `• *Name:* ${formData.fullName.trim()}`,
      `• *Phone:* +91 ${formData.phone.replace(/\D/g, "")}`,
      `• *Address:* ${formData.address.trim()}`,
      ...(formData.city.trim() ? [`• *City:* ${formData.city.trim()}`] : []),
      `• *Pincode:* ${formData.pincode.trim()}`,
      ...(formData.notes.trim() ? [`• *Notes:* ${formData.notes.trim()}`] : []),
      "",
      "📦 *ITEMS ORDERED:*",
      ...orderLines,
      "",
      "💰 *BILL SUMMARY:*",
      `• Subtotal: ₹${subtotal.toFixed(0)}`,
      `• Delivery: ${hasFreeShipping ? "FREE (orders over ₹499)" : "Confirmed on WhatsApp"}`,
      `• *TOTAL: ₹${subtotal.toFixed(0)}*`,
      "",
      "Please confirm my order and share payment details (UPI/QR). Thank you!",
    ];

    const message = messageLines.join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Store state for success view
    setLastOrderDetails({
      itemsCount: totalItems,
      totalAmount: subtotal,
      whatsappUrl,
    });
    setOrderSubmitted(true);

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Clear cart
    clearCart();
    setIsSubmitting(false);
  };

  // Loading skeleton while reading localStorage cart
  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#F0E2C4]" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="h-96 animate-pulse rounded-3xl bg-[#FFF3D6] lg:col-span-7" />
          <div className="h-96 animate-pulse rounded-3xl bg-[#FFF3D6] lg:col-span-5" />
        </div>
      </div>
    );
  }

  // Success view if order was submitted
  if (orderSubmitted && lastOrderDetails) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="rounded-3xl border border-[#F0E2C4] bg-white p-6 sm:p-10 text-center shadow-[0_20px_60px_rgba(62,39,35,0.08)]"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="mt-6 inline-block rounded-full bg-[#FFF3D6] px-4 py-1 text-xs font-semibold text-[#F57C00]">
            Order Initiated via WhatsApp
          </span>

          <h1 className="font-heading mt-3 text-2xl font-bold text-[#3E2723] sm:text-3xl">
            Thank you, {formData.fullName.split(" ")[0]}!
          </h1>

          <p className="mt-3 text-sm text-[#3E2723]/75 leading-relaxed">
            Your artisanal basket with{" "}
            <strong>
              {lastOrderDetails.itemsCount} {lastOrderDetails.itemsCount === 1 ? "item" : "items"} (₹
              {lastOrderDetails.totalAmount})
            </strong>{" "}
            has been compiled. Press send in WhatsApp to confirm your order.
          </p>

          <div className="mt-6 rounded-2xl border border-[#F0E2C4] bg-[#FFF8E7] p-4 text-left text-xs text-[#3E2723]/80 space-y-1.5">
            <p className="font-semibold text-[#3E2723]">Next Steps:</p>
            <p>1. Check the opened WhatsApp chat and press <strong>Send</strong>.</p>
            <p>2. Our team will verify dispatch timing and send the UPI payment QR code.</p>
            <p>3. Your 100% natural, preservative-free snacks will be on their way!</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={lastOrderDetails.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-[#1B5E20]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Reopen WhatsApp Chat</span>
              <ExternalLink className="h-4 w-4 opacity-75" />
            </a>

            <Link
              href="/#shop"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#F0E2C4] bg-[#FFF3D6] px-6 py-3 text-sm font-semibold text-[#3E2723] transition-colors hover:bg-[#F0E2C4]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // If cart is empty and redirect is in flight
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3D6] text-[#3E2723]/50">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="font-heading mt-4 text-xl font-bold text-[#3E2723]">Your basket is empty</h2>
        <p className="mt-2 text-sm text-[#3E2723]/60">Redirecting to our artisanal shop...</p>
        <Link
          href="/#shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-6 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Top navigation & breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 rounded-full border border-[#F0E2C4] bg-white px-4 py-2 text-xs font-semibold text-[#3E2723] shadow-xs transition-colors hover:bg-[#FFF3D6] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shopping</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-[#3E2723]/60">
          <span>Basket</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#2E7D32]">Checkout</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>WhatsApp Confirmation</span>
        </div>
      </div>

      {/* Page Title & Brand Headline */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F57C00]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Anjanadri Artisanal Direct Delivery</span>
        </div>
        <h1 className="font-heading mt-1 text-2xl font-bold text-[#3E2723] sm:text-3xl lg:text-4xl">
          Complete Your Order
        </h1>
        <p className="mt-1 text-sm text-[#3E2723]/70">
          Enter your delivery destination. We will prefill everything into WhatsApp for instant confirmation.
        </p>
      </div>

      {/* Main Grid: Form on Left / Order Summary on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: Delivery Information Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="rounded-3xl border border-[#F0E2C4] bg-white p-5 shadow-[0_12px_40px_rgba(62,39,35,0.06)] sm:p-8 lg:col-span-7"
        >
          <div className="flex items-center gap-3 border-b border-[#F0E2C4] pb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32]">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#3E2723]">
                Delivery Information
              </h2>
              <p className="text-xs text-[#3E2723]/60">
                Where should we dispatch your fresh dehydrated snacks?
              </p>
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3E2723]/80"
              >
                Full Name <span className="text-[#C2410C]">*</span>
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#3E2723]/40">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Ananya Rao"
                  className={`block w-full rounded-2xl border bg-[#FFF8E7]/50 py-3 pl-10 pr-4 text-sm text-[#3E2723] placeholder-[#3E2723]/35 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${
                    errors.fullName ? "border-[#C2410C] bg-red-50/50" : "border-[#F0E2C4]"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[#C2410C]">
                  <AlertCircle className="h-3 w-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3E2723]/80"
              >
                Mobile Number (for WhatsApp &amp; Delivery Updates) <span className="text-[#C2410C]">*</span>
              </label>
              <div className="relative mt-1.5 flex rounded-2xl border border-[#F0E2C4] bg-[#FFF8E7]/50 overflow-hidden focus-within:border-[#2E7D32] focus-within:ring-2 focus-within:ring-[#2E7D32]">
                <span className="flex items-center gap-1 border-r border-[#F0E2C4] bg-[#FFF3D6] px-3.5 text-xs font-bold text-[#3E2723]">
                  <Phone className="h-3.5 w-3.5 text-[#2E7D32]" />
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="98765 43210"
                  maxLength={14}
                  className={`block w-full bg-transparent py-3 px-4 text-sm text-[#3E2723] placeholder-[#3E2723]/35 focus:outline-none ${
                    errors.phone ? "bg-red-50/50" : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[#C2410C]">
                  <AlertCircle className="h-3 w-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Street Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3E2723]/80"
              >
                Street Address / Apartment / House No. <span className="text-[#C2410C]">*</span>
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute top-3.5 left-3.5 text-[#3E2723]/40">
                  <MapPin className="h-4 w-4" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Flat No, Apartment Name, Street, Landmark"
                  className={`block w-full rounded-2xl border bg-[#FFF8E7]/50 py-3 pl-10 pr-4 text-sm text-[#3E2723] placeholder-[#3E2723]/35 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${
                    errors.address ? "border-[#C2410C] bg-red-50/50" : "border-[#F0E2C4]"
                  }`}
                />
              </div>
              {errors.address && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[#C2410C]">
                  <AlertCircle className="h-3 w-3" /> {errors.address}
                </p>
              )}
            </div>

            {/* City (optional) & Pincode */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3E2723]/80"
                >
                  City <span className="text-[#3E2723]/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Mysuru"
                  className="mt-1.5 block w-full rounded-2xl border border-[#F0E2C4] bg-[#FFF8E7]/50 py-3 px-3.5 text-sm text-[#3E2723] placeholder-[#3E2723]/35 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3E2723]/80"
                >
                  Pincode <span className="text-[#C2410C]">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  placeholder="570001"
                  maxLength={6}
                  className={`mt-1.5 block w-full rounded-2xl border bg-[#FFF8E7]/50 py-3 px-3.5 text-sm text-[#3E2723] placeholder-[#3E2723]/35 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${
                    errors.pincode ? "border-[#C2410C] bg-red-50/50" : "border-[#F0E2C4]"
                  }`}
                />
                {errors.pincode && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#C2410C]">
                    <AlertCircle className="h-3 w-3" /> {errors.pincode}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery / Order Notes (Optional) */}
            <div>
              <label
                htmlFor="notes"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3E2723]/80"
              >
                Order Notes / Special Instructions <span className="text-[#3E2723]/40">(Optional)</span>
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute top-3.5 left-3.5 text-[#3E2723]/40">
                  <FileText className="h-4 w-4" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  maxLength={NOTES_MAX_LENGTH}
                  placeholder="e.g. Leave with security guard, send gift message, or preferred delivery timing"
                  className={`block w-full rounded-2xl border bg-[#FFF8E7]/50 py-3 pl-10 pr-4 text-sm text-[#3E2723] placeholder-[#3E2723]/35 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${
                    errors.notes ? "border-[#C2410C] bg-red-50/50" : "border-[#F0E2C4]"
                  }`}
                />
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                {errors.notes ? (
                  <p className="flex items-center gap-1 text-xs text-[#C2410C]">
                    <AlertCircle className="h-3 w-3" /> {errors.notes}
                  </p>
                ) : (
                  <span />
                )}
                <span className="shrink-0 text-[11px] text-[#3E2723]/50">
                  {formData.notes.length}/{NOTES_MAX_LENGTH}
                </span>
              </div>
            </div>

            {/* Desktop form submit button (also repeated in summary) */}
            <div className="hidden lg:block pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#2E7D32] py-4 px-6 text-base font-semibold text-white shadow-[0_10px_25px_rgba(46,125,50,0.3)] transition-all duration-300 hover:bg-[#1B5E20] hover:shadow-[0_14px_30px_rgba(46,125,50,0.4)] disabled:opacity-50"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Send Order via WhatsApp • ₹{subtotal.toFixed(0)}</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: Order Summary & Instant Checkout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.05 }}
          className="order-first space-y-6 lg:order-none lg:col-span-5"
        >
          {/* Summary Card */}
          <div className="rounded-3xl border border-[#F0E2C4] bg-white p-5 shadow-[0_12px_40px_rgba(62,39,35,0.06)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#F0E2C4] pb-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-[#2E7D32]" />
                <h2 className="font-heading text-lg font-semibold text-[#3E2723]">
                  Artisanal Basket
                </h2>
              </div>
              <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#F57C00]">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Free Shipping Progress bar */}
            <div className="mt-4 rounded-2xl bg-[#FFF3D6] p-3 border border-[#F0E2C4]/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#3E2723]">
                  {freeShippingDiff > 0 ? (
                    <>
                      Add <strong className="text-[#F57C00]">₹{freeShippingDiff.toFixed(0)}</strong> for free shipping
                    </>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-[#2E7D32]">
                      <Sparkles className="h-3.5 w-3.5" /> Free shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-semibold text-[#3E2723]/60">
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

            {/* Item List */}
            <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-[#F0E2C4]/60 pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3.5 py-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-[#F0E2C4] bg-[#FFF8E7]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#3E2723] truncate">{product.name}</p>
                    <p className="text-[11px] text-[#3E2723]/55">
                      {product.weight || "Pack"} &bull; ₹{product.price} each
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-[#F0E2C4] bg-[#FFF8E7] px-1.5 py-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-0.5 text-[#3E2723]/60 hover:text-[#3E2723]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-[#3E2723]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-0.5 text-[#3E2723]/60 hover:text-[#3E2723]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1 text-[#3E2723]/40 hover:text-[#C2410C]"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-heading text-sm font-bold text-[#3E2723]">
                      ₹{(product.price * quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="mt-4 border-t border-[#F0E2C4] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#3E2723]/70">
                <span>Basket Subtotal</span>
                <span className="font-semibold text-[#3E2723]">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[#3E2723]/70">
                <span>Delivery</span>
                <span>
                  {hasFreeShipping ? (
                    <span className="font-semibold text-[#2E7D32]">Free shipping</span>
                  ) : (
                    "Confirmed on WhatsApp"
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#F0E2C4] pt-2.5 text-sm font-bold text-[#3E2723]">
                <span className="font-heading text-base">Total</span>
                <span className="font-heading text-xl text-[#2E7D32]">₹{subtotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Mobile / Direct CTA in Card */}
            <div className="mt-5">
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] py-4 px-6 text-base font-semibold text-white shadow-[0_10px_25px_rgba(46,125,50,0.3)] transition-all duration-300 hover:bg-[#1B5E20] hover:shadow-[0_14px_30px_rgba(46,125,50,0.4)] disabled:opacity-50"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Send Order via WhatsApp</span>
              </button>
              <p className="mt-2 text-center text-[11px] text-[#3E2723]/60">
                Direct WhatsApp confirmation • Pay via UPI/COD on chat
              </p>
            </div>
          </div>

          {/* Trust & Guarantee Box */}
          <div className="rounded-3xl border border-[#F0E2C4] bg-[#FFF3D6]/70 p-5 space-y-3">
            <h3 className="font-heading text-sm font-semibold text-[#3E2723] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
              The Anjanadri Promise
            </h3>
            <ul className="space-y-2 text-xs text-[#3E2723]/75">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
                100% Natural Mysore bananas, mangoes, and crisps.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
                Zero added sugar, no artificial preservatives, vegan friendly.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
                Hygienically packaged and dispatched directly from Mysore.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
