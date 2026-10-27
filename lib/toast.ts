"use client";

import { toast } from "sonner";

export function showToast(message: string) {
  return toast(message);
}

export function notifyAddedToCart(productName: string) {
  return toast.success(`Added to Cart: ${productName}`);
}
