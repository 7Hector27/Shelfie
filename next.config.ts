import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Shelfie profile images (existing)
      {
        protocol: "https",
        hostname: "shelfie-profile-images.s3.us-west-1.amazonaws.com",
        pathname: "/**",
      },

      // Open Library book covers (ADD THIS)
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
