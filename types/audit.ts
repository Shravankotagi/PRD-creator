// ─── Severity Levels ───────────────────────────────────────────────────────
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export type Urgency = 'HIGH' | 'MEDIUM' | 'LOW'

// ─── Dimension Keys ─────────────────────────────────────────────────────────
export type DimensionKey =
  | 'scalability'
  | 'observability'
  | 'security'
  | 'cicdMaturity'
  | 'dataArchitecture'

// ─── Core Audit Pieces ──────────────────────────────────────────────────────
export interface Dimension {
  key: DimensionKey
  label: string
  score: number // 0–100
}

export interface Strength {
  title: string
  detail: string
}

export interface Risk {
  title: string
  severity: Severity
  confidence?: 'HIGH' | 'MEDIUM'
  detail: string
  impact: string
  evidence?: string
}

export interface Recommendation {
  title: string
  service: string   // maps to Enlight Lab service name
  detail: string
  urgency: Urgency
}

// ─── Gemini Raw Output (what AI returns) ────────────────────────────────────
export interface GeminiAuditOutput {
  overallScore: number
  dimensions: {
    scalability: number
    observability: number
    security: number
    cicdMaturity: number
    dataArchitecture: number
  }
  technologies: string[]
  strengths: Strength[]
  risks: Risk[]
  recommendations: Recommendation[]
  summary: string           // 2–3 sentence executive summary
  maturityLevel: string     // e.g. "Early-Stage", "Growth", "Mature"
}

// ─── Full Audit Result (stored in DB + used in UI) ──────────────────────────
export interface AuditResult {
  id: string
  shareId: string
  inputText: string
  overallScore: number
  maturityLevel: string
  summary: string
  dimensions: Dimension[]
  technologies: string[]
  strengths: Strength[]
  risks: Risk[]
  unknowns?: string[]
  recommendations: Recommendation[]
  createdAt: string
  assessmentConfidence?: {
  high_confidence: string[]
  medium_confidence: string[]
  unknown: string[]
}
}

// ─── Email Capture ───────────────────────────────────────────────────────────
export interface EmailCapture {
  id: string
  auditId: string
  name: string
  email: string
  company?: string
  createdAt: string
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
export interface AdminAudit {
  id: string
  shareId: string
  overallScore: number
  maturityLevel: string
  technologies: string[]
  risks: Risk[]
  createdAt: string
  emailsSent: EmailCapture[]
}

// ─── API Response Shapes ─────────────────────────────────────────────────────
export interface AuditApiResponse {
  success: boolean
  shareId: string
  result: AuditResult
}

export interface AuditApiError {
  success: false
  error: string
  code: 'RATE_LIMIT' | 'INVALID_INPUT' | 'AI_ERROR' | 'DB_ERROR'
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────
export const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: 'Critical', color: '#dc2626', bg: '#fef2f2' },
  HIGH:     { label: 'High',     color: '#ea580c', bg: '#fff7ed' },
  MEDIUM:   { label: 'Medium',   color: '#ca8a04', bg: '#fefce8' },
  LOW:      { label: 'Low',      color: '#16a34a', bg: '#f0fdf4' },
}

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  scalability:      'Scalability',
  observability:    'Observability',
  security:         'Security',
  cicdMaturity:     'CI/CD Maturity',
  dataArchitecture: 'Data Architecture',
}

// Converts raw Gemini dimensions object → Dimension[] for radar chart
export function parseDimensions(raw: GeminiAuditOutput['dimensions']): Dimension[] {
  return (Object.keys(DIMENSION_LABELS) as DimensionKey[]).map((key) => ({
    key,
    label: DIMENSION_LABELS[key],
    score: raw[key],
  }))
}