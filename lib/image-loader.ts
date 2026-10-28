"use client";

import type { ImageLoaderProps } from "next/image";

export function canOptimizeImage(src: string): boolean {
  return src.startsWith("https://cdn.sanity.io/images/") ||
    src.startsWith("https://images.unsplash.com/");
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!canOptimizeImage(src)) return src;
  const url = new URL(src);
  const previousWidth = Number(url.searchParams.get("w"));
  const previousHeight = Number(url.searchParams.get("h"));
  if (previousWidth > 0 && previousHeight > 0) {
    url.searchParams.set("h", String(Math.max(1, Math.round(previousHeight * width / previousWidth))));
  }
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fm", "webp");
  url.searchParams.set("fit", "max");
  url.searchParams.delete("auto");
  return url.toString();
}
