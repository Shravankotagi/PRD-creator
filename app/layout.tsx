import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PRD Creator — Enlight Lab',
  description:
    'Generate a complete, engineering-ready Product Requirements Document in minutes.',
  keywords: [
    'PRD creator',
    'product requirements document',
    'product manager tool',
    'AI PRD generator',
    'Enlight Lab',
  ],
  openGraph: {
    title: 'PRD Creator — Enlight Lab',
    description:
      'Generate a complete, engineering-ready PRD in minutes using AI.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Enlight Lab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRD Creator — Enlight Lab',
    description: 'Generate a complete, engineering-ready PRD in minutes using AI.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-el-bg flex flex-col">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e2d6b',
            },
          }}
        />
      </body>
    </html>
  )
}