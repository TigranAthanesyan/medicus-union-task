import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['cloudinary'],
  },
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'flagcdn.com'],
  },
  devIndicators: false,
};

export default nextConfig;
