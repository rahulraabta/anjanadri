import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "cmdk", "sonner"],
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
