import type { NextConfig } from "next";
import legacyImagePaths from "./src/data/legacy-image-paths.json";

const nextConfig: NextConfig = {
  async rewrites() {
    // Preserve existing Stripe images, shared links and cached client URLs
    // while the source photos live in their organized folders.
    return { beforeFiles: Object.entries(legacyImagePaths).map(([source, destination]) => ({ source, destination })) };
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/images/packaging/*-pouch.png" },
      { pathname: "/images/**", search: "" },
      { pathname: "/_next/static/media/**", search: "" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
