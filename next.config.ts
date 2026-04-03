import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        // pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "adept-dog-472.convex.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
