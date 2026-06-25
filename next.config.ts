import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["@prisma/client", "@react-pdf/renderer"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enlightlab.com",
      },
      {
        protocol: "https",
        hostname: "*.enlightlab.com",
      },
    ],
  },
};

export default nextConfig;