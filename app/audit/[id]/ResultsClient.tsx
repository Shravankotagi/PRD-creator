'use client'
import PDFDownloadButton from '@/components/results/PDFDownloadButton'
import { type AuditResult } from '@/types/audit'
import ScoreRing from '@/components/results/ScoreRing'
import RadarChart from '@/components/results/RadarChart'
import RiskCard from '@/components/results/RiskCard'
import StrengthCard from '@/components/results/StrengthCard'
import RecommendationCard from '@/components/results/RecommendationCard'
import TechBadgeList from '@/components/results/TechBadgeList'
import ShareButton from '@/components/results/ShareButton'
import EmailCaptureForm from '@/components/results/EmailCaptureForm'

interface Props {
  result: AuditResult
}

export default function ResultsClient({ result }: Props) {
  const {
    overallScore,
    maturityLevel,
    summary,
    dimensions,
    technologies,
    strengths,
    risks,
    recommendations,
    shareId,
    createdAt,
  } = result

  const criticalRisks = risks.filter((r) => r.severity === 'CRITICAL')
  const highRisks     = risks.filter((r) => r.severity === 'HIGH')
  const otherRisks    = risks.filter((r) => r.severity !== 'CRITICAL' && r.severity !== 'HIGH')

  return (
    <div className="min-h-screen bg-el-bg">

      {/* ── Header Band ───────────────────────────────────────────── */}
      <div className="bg-el-navy py-10">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
            Tech Stack Audit Report
          </p>
          <h1 className="text-white font-bold text-2xl md:text-3xl mb-1">
            Your Stack Analysis
          </h1>
          <p className="text-white/60 text-sm">
            Generated {new Date(createdAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="el-divider-band" />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* ── Score + Summary ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Score ring */}
          <div className="el-card flex flex-col items-center justify-center text-center">
            <ScoreRing score={overallScore} size={140} />
            <p className="mt-3 text-sm font-semibold text-el-heading">{maturityLevel}</p>
            <p className="text-xs text-el-muted mt-1">Overall Score</p>
          </div>

          {/* Summary */}
          <div className="el-card md:col-span-2 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-el-heading font-bold text-lg mb-2">Executive Summary</h2>
              <p className="text-el-body text-sm leading-relaxed">{summary}</p>
            </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-el-border">
                    <ShareButton shareId={shareId} />
                    <PDFDownloadButton result={result} />
                    <a
                        href="/analyze"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-el-border text-sm font-semibold text-el-body hover:border-el-blue hover:text-el-blue transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                        </svg>
                        Retake
                    </a>
                </div>
          </div>
        </div>

        {/* ── Radar Chart ───────────────────────────────────────────── */}
        <div className="el-card">
          <h2 className="text-el-heading font-bold text-lg mb-4">
            Dimension Scores
          </h2>
          <RadarChart dimensions={dimensions} />
        </div>

        {/* ── Technologies Detected ─────────────────────────────────── */}
        {technologies.length > 0 && (
          <div className="el-card">
            <h2 className="text-el-heading font-bold text-lg mb-4">
              Technologies Detected
            </h2>
            <TechBadgeList technologies={technologies} />
          </div>
        )}

        {/* ── Risks ─────────────────────────────────────────────────── */}
        {risks.length > 0 && (
          <div>
            <h2 className="text-el-heading font-bold text-xl mb-4">
              Risk Areas
              <span className="ml-2 text-sm font-normal text-el-muted">
                ({risks.length} identified)
              </span>
            </h2>

            {criticalRisks.length > 0 && (
              <div className="mb-4 space-y-3">
                {criticalRisks.map((risk, i) => (
                  <RiskCard key={i} risk={risk} />
                ))}
              </div>
            )}

            {highRisks.length > 0 && (
              <div className="mb-4 space-y-3">
                {highRisks.map((risk, i) => (
                  <RiskCard key={i} risk={risk} />
                ))}
              </div>
            )}

            {otherRisks.length > 0 && (
              <div className="space-y-3">
                {otherRisks.map((risk, i) => (
                  <RiskCard key={i} risk={risk} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Strengths ─────────────────────────────────────────────── */}
        {strengths.length > 0 && (
          <div>
            <h2 className="text-el-heading font-bold text-xl mb-4">
              Strengths
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {strengths.map((strength, i) => (
                <StrengthCard key={i} strength={strength} index={i} />
               ))}
            </div>
          </div>
        )}

        {/* ── Recommendations ───────────────────────────────────────── */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-el-heading font-bold text-xl mb-4">
              Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} index={i} />
                ))}
            </div>
          </div>
        )}

        {/* ── Email Capture ─────────────────────────────────────────── */}
        <div className="el-card bg-el-navy border-0">
          <EmailCaptureForm auditId={result.id} />
        </div>

      </div>
    </div>
  )
}