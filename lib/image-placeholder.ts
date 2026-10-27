import type { SanityProduct } from "./sanity";

export function getImageBlurDataURL(
  product: Pick<SanityProduct, "image" | "imageBlurDataURL" | "imageDominantColor">,
): string {
  if (product.imageBlurDataURL?.match(/^data:image\/(jpeg|png|webp);base64,/)) {
    return product.imageBlurDataURL;
  }

  const color = /^#([\da-f]{3}|[\da-f]{6})$/i.test(product.imageDominantColor ?? "")
    ? product.imageDominantColor
    : "#FFF3D6";
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><path fill="${color}" d="M0 0h1v1H0z"/></svg>`,
  )}`;
}
