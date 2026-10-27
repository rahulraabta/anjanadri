import { getProducts } from "@/lib/sanity-products";
import { urlFor } from "@/lib/sanity";
import type { SearchProduct } from "@/lib/product-search";

export const dynamic = "force-static";

export async function GET() {
  const products: SearchProduct[] = (await getProducts()).map((product) => ({
    id: product._id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    imageUrl: typeof product.image === "string"
      ? product.image
      : urlFor(product.image).width(96).height(96).fit("crop").auto("format").url(),
    category: product.category ?? "",
    description: product.shortDescription ?? product.description,
    tags: product.tags ?? [],
    isBestSeller: product.isBestSeller === true || product.badge === "Best Seller",
  }));

  return Response.json(products);
}
