import { z } from 'zod'

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

const SeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
const UrgencySchema  = z.enum(['HIGH', 'MEDIUM', 'LOW'])

const StrengthSchema = z.object({
  title:  z.string().min(1),
  detail: z.string().min(1),
})

const RiskSchema = z.object({
  title:      z.string().min(1),
  severity:   SeveritySchema,
  confidence: z.enum(['HIGH', 'MEDIUM']).optional(),
  evidence:   z.string().optional(),
  detail:     z.string().min(1),
  impact:     z.string().min(1),
})

const RecommendationSchema = z.object({
  title:   z.string().min(1),
  service: z.string().min(1),
  detail:  z.string().min(1),
  urgency: UrgencySchema,
})

const DimensionsSchema = z.object({
  scalability:      z.number().int().min(0).max(100),
  observability:    z.number().int().min(0).max(100),
  security:         z.number().int().min(0).max(100),
  cicdMaturity:     z.number().int().min(0).max(100),
  dataArchitecture: z.number().int().min(0).max(100),
})

// ─── Master Audit Output Schema ───────────────────────────────────────────────
export const AuditOutputSchema = z.object({
  overallScore:    z.number().int().min(0).max(100),
  maturityLevel:   z.enum(['Early-Stage', 'Growth', 'Scaling', 'Mature', 'Enterprise']),
  summary:         z.string().min(10),
  dimensions:      DimensionsSchema,
  technologies:    z.array(z.string()).min(1).max(30),
  strengths:       z.array(StrengthSchema).min(0).max(6),
  risks:           z.array(RiskSchema).min(0).max(8),
  unknowns:        z.array(z.string()).optional(),
  recommendations: z.array(RecommendationSchema).min(1).max(6),
  assessmentConfidence: z.object({
  high_confidence:   z.array(z.string()).optional(),
  medium_confidence: z.array(z.string()).optional(),
  unknown:           z.array(z.string()).optional(),
}).optional(),
})

// ─── Inferred Type ────────────────────────────────────────────────────────────
export type AuditOutput = z.infer<typeof AuditOutputSchema>

// ─── Validator function ───────────────────────────────────────────────────────
export function validateAuditOutput(raw: unknown): {
  success: true;  data: AuditOutput
} | {
  success: false; error: string
} {
  const result = AuditOutputSchema.safeParse(raw)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    error: result.error.issues.map((i) => i.message).join(', '),
  }
}

// ─── Email Capture Schema ─────────────────────────────────────────────────────
export const EmailCaptureSchema = z.object({
  auditId: z.string().min(1),
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  company: z.string().max(100).optional(),
})

// ─── Input Validation Schema ──────────────────────────────────────────────────
export const AuditInputSchema = z.object({
  stackText: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your stack.')
    .max(5000, 'Input exceeds 5000 character limit.'),
})