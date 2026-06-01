'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { AuditResult, Severity } from '@/types/audit'

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 52,
    fontSize: 10,
    color: '#1a1a2e',
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1a3fdb',
  },
  headerLeft: { flexDirection: 'column', gap: 2 },
  brandName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1a3fdb' },
  reportTitle: { fontSize: 11, color: '#4b5563', marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  dateText: { fontSize: 9, color: '#94a3b8' },
  confidentialBadge: {
    marginTop: 4,
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Score Section ──
  scoreSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f8f9fc',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1a3fdb',
  },
  scoreBig: { fontSize: 42, fontFamily: 'Helvetica-Bold', color: '#1a3fdb' },
  scoreLabel: { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  scoreRight: { flex: 1, justifyContent: 'center' },
  maturityLabel: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 4 },
  summaryText: { fontSize: 10, color: '#4b5563', lineHeight: 1.6 },

  // ── Section ──
  section: { marginBottom: 22 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Dimensions Table ──
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 10,
  },
  dimLabel: { width: 120, fontSize: 10, color: '#4b5563' },
  dimBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  dimBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1a3fdb',
  },
  dimScore: { width: 32, fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a', textAlign: 'right' },

  // ── Tech Badges ──
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  techBadge: {
    fontSize: 9,
    color: '#1a3fdb',
    backgroundColor: '#e8edfb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c7d2f8',
  },

  // ── Risk Cards ──
  riskCard: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  riskTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a', flex: 1, marginRight: 8 },
  severityBadge: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  riskDetail: { fontSize: 9, color: '#4b5563', lineHeight: 1.5, marginBottom: 5 },
  impactLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  impactText: { fontSize: 9, color: '#64748b', lineHeight: 1.4, fontStyle: 'italic' },

  // ── Strength Cards ──
  strengthCard: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
  },
  strengthTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#065f46', marginBottom: 4 },
  strengthDetail: { fontSize: 9, color: '#374151', lineHeight: 1.5 },

  // ── Recommendation Cards ──
  recCard: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 3,
    borderLeftColor: '#1a3fdb',
  },
  recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  recTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a', flex: 1, marginRight: 8 },
  recService: {
    fontSize: 8,
    color: '#1a3fdb',
    backgroundColor: '#e8edfb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recDetail: { fontSize: 9, color: '#4b5563', lineHeight: 1.5, marginBottom: 4 },
  urgencyRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  urgencyLabel: { fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  urgencyValue: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0f172a' },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: { fontSize: 8, color: '#94a3b8' },
  footerBrand: { fontSize: 8, color: '#1a3fdb', fontFamily: 'Helvetica-Bold' },

  // ── CTA Box ──
  ctaBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#0d1b4b',
    borderRadius: 6,
  },
  ctaTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 4 },
  ctaText: { fontSize: 9, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 8 },
  ctaUrl: { fontSize: 9, color: '#60a5fa', textDecoration: 'underline' },
})

// ─── Severity Colors ──────────────────────────────────────────────────────────
function getSeverityColors(severity: Severity) {
  switch (severity) {
    case 'CRITICAL': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    case 'HIGH':     return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' }
    case 'MEDIUM':   return { bg: '#fefce8', color: '#ca8a04', border: '#fde68a' }
    case 'LOW':      return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
  }
}

function getDimBarColor(score: number) {
  if (score >= 75) return '#16a34a'
  if (score >= 50) return '#1a3fdb'
  if (score >= 30) return '#ea580c'
  return '#dc2626'
}

// ─── PDF Document ─────────────────────────────────────────────────────────────
interface AuditPDFProps {
  result: AuditResult
}

export default function AuditPDF({ result }: AuditPDFProps) {
  const {
    overallScore,
    maturityLevel,
    summary,
    dimensions,
    technologies,
    strengths,
    risks,
    recommendations,
    createdAt,
    shareId,
  } = result

  const date = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <Document
      title={`Tech Stack Audit — ${maturityLevel} (${overallScore}/100)`}
      author="Enlight Lab"
      subject="Tech Stack Audit Report"
    >
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>Enlight Lab</Text>
            <Text style={styles.reportTitle}>Tech Stack Audit Report</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.confidentialBadge}>Confidential</Text>
          </View>
        </View>

        {/* ── Score + Summary ── */}
        <View style={styles.scoreSection}>
          <View>
            <Text style={styles.scoreBig}>{overallScore}</Text>
            <Text style={styles.scoreLabel}>OUT OF 100</Text>
          </View>
          <View style={styles.scoreRight}>
            <Text style={styles.maturityLabel}>{maturityLevel} Maturity</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        </View>

        {/* ── Dimension Scores ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimension Scores</Text>
          {dimensions.map((dim) => (
            <View key={dim.key} style={styles.dimRow}>
              <Text style={styles.dimLabel}>{dim.label}</Text>
              <View style={styles.dimBarBg}>
                <View style={[styles.dimBarFill, {
                  width: `${dim.score}%` as any,
                  backgroundColor: getDimBarColor(dim.score),
                }]} />
              </View>
              <Text style={styles.dimScore}>{dim.score}</Text>
            </View>
          ))}
        </View>

        {/* ── Technologies ── */}
        {technologies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technologies Detected</Text>
            <View style={styles.techRow}>
              {technologies.map((tech, i) => (
                <Text key={i} style={styles.techBadge}>{tech}</Text>
              ))}
            </View>
          </View>
        )}

        {/* ── Risks ── */}
        {risks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Areas ({risks.length} identified)</Text>
            {risks.map((risk, i) => {
              const colors = getSeverityColors(risk.severity)
              return (
                <View key={i} style={[styles.riskCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                  <View style={styles.riskHeader}>
                    <Text style={styles.riskTitle}>{risk.title}</Text>
                    <Text style={[styles.severityBadge, { color: colors.color, backgroundColor: '#fff' }]}>
                      {risk.severity}
                    </Text>
                  </View>
                  <Text style={styles.riskDetail}>{risk.detail}</Text>
                  <Text style={styles.impactLabel}>Business Impact</Text>
                  <Text style={styles.impactText}>{risk.impact}</Text>
                </View>
              )
            })}
          </View>
        )}

        {/* ── Strengths ── */}
        {strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strengths</Text>
            {strengths.map((s, i) => (
              <View key={i} style={styles.strengthCard}>
                <Text style={styles.strengthTitle}>{s.title}</Text>
                <Text style={styles.strengthDetail}>{s.detail}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Recommendations ── */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {recommendations.map((rec, i) => (
              <View key={i} style={styles.recCard}>
                <View style={styles.recHeader}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recService}>{rec.service}</Text>
                </View>
                <Text style={styles.recDetail}>{rec.detail}</Text>
                <View style={styles.urgencyRow}>
                  <Text style={styles.urgencyLabel}>Urgency:</Text>
                  <Text style={styles.urgencyValue}>{rec.urgency}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── CTA ── */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to address these findings?</Text>
          <Text style={styles.ctaText}>
            Book a 30-minute discovery call with an Enlight Lab engineer. We'll walk through your audit results and outline exactly how we'd address each risk.
          </Text>
          <Text style={styles.ctaUrl}>enlightlab.com/contact</Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Report ID: {shareId} · Generated by Enlight Lab
          </Text>
          <Text style={styles.footerBrand}>enlightlab.com</Text>
        </View>

      </Page>
    </Document>
  )
}