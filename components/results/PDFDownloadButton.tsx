'use client'

import { useState, useEffect } from 'react'
import type { AuditResult } from '@/types/audit'

interface PDFDownloadButtonProps {
  result: AuditResult
}

export default function PDFDownloadButton({ result }: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleDownload() {
    setLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: AuditPDF } = await import('./AuditPDF')
      const { createElement } = await import('react')
      const blob = await pdf(createElement(AuditPDF, { result }) as any).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `enlight-lab-audit-${result.shareId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-el-border text-sm font-semibold text-el-body hover:border-el-blue hover:text-el-blue transition-colors duration-200 no-print"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Preparing PDF...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </>
      )}
    </button>
  )
}