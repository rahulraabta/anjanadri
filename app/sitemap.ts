import { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/sanity-products";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Builds product URLs from the same published catalog as generateStaticParams. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/build-a-box`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const productPages = (await getProductSlugs()).map(({ slug }) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
