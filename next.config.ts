import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "profile-images-shelfie.s3.us-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/user/:path*",
        destination: "http://localhost:4000/user/:path*",
      },
    ];
  },
};

export default nextConfig;
