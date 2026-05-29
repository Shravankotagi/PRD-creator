'use client'

import { useEffect, useState } from 'react'
import StatsCards from '@/components/admin/StatsCards'
import ReportsTable from '@/components/admin/ReportsTable'
import EmailCaptureTable from '@/components/admin/EmailCaptureTable'
import AdminBarChart from '@/components/admin/AdminBarChart'

interface AdminData {
  stats: {
    totalAudits: number
    totalCaptures: number
    avgScore: number
    shareRate: number
  }
  audits: any[]
  emailsSent: any[]
}

export default function AdminPage() {
  const [key, setKey]         = useState('')
  const [authed, setAuthed]   = useState(false)
  const [data, setData]       = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState<'reports' | 'emails' | 'charts'>('reports')

  async function fetchData(adminKey: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin', {
        headers: { 'x-admin-key': adminKey },
      })
      if (res.status === 401) { setError('Invalid admin key.'); return }
      const json = await res.json()
      setData(json)
      setAuthed(true)
    } catch {
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-el-bg flex items-center justify-center px-4">
        <div className="el-card w-full max-w-sm">
          <h1 className="font-bold text-xl text-el-heading mb-1">Admin Dashboard</h1>
          <p className="text-sm text-el-muted mb-6">Enter your admin key to continue.</p>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData(key)}
            className="w-full px-3 py-2 text-sm border border-el-border rounded-md mb-3
                       focus:outline-none focus:ring-2 focus:ring-el-blue"
          />
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <button
            onClick={() => fetchData(key)}
            disabled={loading}
            className="btn-el-primary w-full text-sm disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Access Dashboard'}
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-el-bg">
      <div className="bg-el-navy py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-white font-bold text-2xl">Admin Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">Tech Stack Auditor — Enlight Lab</p>
        </div>
      </div>
      <div className="el-divider-band" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Stats */}
        <div className="mb-10">
          <StatsCards
            totalAudits={data.stats.totalAudits}
            avgScore={data.stats.avgScore}
            emailsSent={data.stats.totalCaptures}
            shareRate={data.stats.shareRate}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-el-border">
          {(['reports', 'emails', 'charts'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors
                ${tab === t
                  ? 'border-b-2 border-el-blue text-el-blue'
                  : 'text-el-muted hover:text-el-body'
                }`}
            >
              {t === 'reports' ? `Reports (${data.audits.length})`
               : t === 'emails' ? `Email Leads (${data.emailsSent.length})`
               : 'Charts'}
            </button>
          ))}
        </div>

        {tab === 'reports' && <ReportsTable audits={data.audits} />}
        {tab === 'emails'  && <EmailCaptureTable captures={data.emailsSent} />}
        {tab === 'charts'  && <AdminBarChart audits={data.audits} />}

      </div>
    </div>
  )
}