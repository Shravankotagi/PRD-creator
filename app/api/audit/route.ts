import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { runAudit } from '@/lib/gemini'
import { generateShareId } from '@/lib/nanoid'
import { ratelimit, getRateLimitIdentifier } from '@/lib/ratelimit'
import { AuditInputSchema } from '@/lib/schema'
import { parseDimensions } from '@/types/audit'

export async function POST(req: NextRequest) {

  // ── 1. Rate Limit ───────────────────────────────────────────────────────────
  const identifier = getRateLimitIdentifier(req)
  const { success: rateLimitOk, limit, remaining, reset } = await ratelimit.limit(identifier)

  if (!rateLimitOk) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. You can run 5 audits per hour.',
        code: 'RATE_LIMIT',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit':     String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset':     String(reset),
        },
      }
    )
  }

  // ── 2. Parse & Validate Input ───────────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.', code: 'INVALID_INPUT' },
      { status: 400 }
    )
  }

  const parsed = AuditInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid input.',
        code: 'INVALID_INPUT',
      },
      { status: 400 }
    )
  }

  const { stackText } = parsed.data

  // ── 3. Run AI Audit ─────────────────────────────────────────────────────────
  const auditResult = await runAudit(stackText)

  if (!auditResult.success) {
    const failResult = auditResult as { success: false; error: string; code: string }
    return NextResponse.json(
      {
        success: false,
        error: failResult.error,
        code: failResult.code,
      },
      { status: 500 }
    )
  }

  const { data } = auditResult

  // ── 4. Generate Share ID ────────────────────────────────────────────────────
  const shareId = generateShareId()

  // ── 5. Save to Database ─────────────────────────────────────────────────────
  let audit
  try {
    audit = await prisma.audit.create({
      data: {
        shareId,
        inputText:       stackText,
        overallScore:    data.overallScore,
        scalability:     data.dimensions.scalability,
        observability:   data.dimensions.observability,
        security:        data.dimensions.security,
        cicdMaturity:    data.dimensions.cicdMaturity,
        dataArch:        data.dimensions.dataArchitecture,
        maturityLevel:   data.maturityLevel,
        summary:         data.summary,
        technologies:    data.technologies,
        strengths:       data.strengths as object[],
        risks:           data.risks as object[],
        recommendations: data.recommendations as object[],
      },
    })
  } catch (err) {
    console.error('[DB Error]', err)
    return NextResponse.json(
      { success: false, error: 'Failed to save audit.', code: 'DB_ERROR' },
      { status: 500 }
    )
  }

  // ── 6. Shape Response ───────────────────────────────────────────────────────
const dimensions = parseDimensions({
  scalability:      data.dimensions.scalability      ?? 0,
  observability:    data.dimensions.observability    ?? 0,
  security:         data.dimensions.security         ?? 0,
  cicdMaturity:     data.dimensions.cicdMaturity     ?? 0,
  dataArchitecture: data.dimensions.dataArchitecture ?? 0,
})

  return NextResponse.json({
    success: true,
    shareId: audit.shareId,
    result: {
      id:              audit.id,
      shareId:         audit.shareId,
      inputText:       audit.inputText,
      overallScore:    data.overallScore,
      maturityLevel:   data.maturityLevel,
      summary:         data.summary,
      dimensions,
      technologies:    data.technologies,
      strengths:       data.strengths,
      risks:           data.risks,
      recommendations: data.recommendations,
      createdAt:       audit.createdAt.toISOString(),
    },
  })
}