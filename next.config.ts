import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  experimental: {
    optimizePackageImports: ['@react-pdf/renderer'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@react-pdf/renderer']
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'enlightlab.com' },
    ],
  },
}

export default nextConfig