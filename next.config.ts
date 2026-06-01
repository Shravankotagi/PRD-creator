import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'enlightlab.com' },
    ],
  },
}

export default nextConfig