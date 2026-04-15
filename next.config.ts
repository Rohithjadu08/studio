
import type { NextConfig } from "next";

const nextConfig: any = {
  experimental: {
    allowedDevOrigins: ["https://*.cloudworkstations.dev"],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'storage.googleapis.com' }
    ],
  },
};

export default nextConfig;
