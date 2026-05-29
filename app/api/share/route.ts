import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseDimensions } from '@/types/audit'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: shareId } = await params

  if (!shareId) {
    return NextResponse.json({ error: 'Share ID required.' }, { status: 400 })
  }

  try {
    const audit = await prisma.audit.findUnique({
      where: { shareId },
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found.' }, { status: 404 })
    }

    const dimensions = parseDimensions({
      scalability:      audit.scalability,
      observability:    audit.observability,
      security:         audit.security,
      cicdMaturity:     audit.cicdMaturity,
      dataArchitecture: audit.dataArch,
    })

    return NextResponse.json({
      success: true,
      result: {
        id:              audit.id,
        shareId:         audit.shareId,
        overallScore:    audit.overallScore,
        maturityLevel:   audit.maturityLevel,
        summary:         audit.summary,
        dimensions,
        technologies:    audit.technologies,
        strengths:       audit.strengths,
        risks:           audit.risks,
        recommendations: audit.recommendations,
        createdAt:       audit.createdAt.toISOString(),
      },
    })
  } catch (err) {
    console.error('[Share fetch error]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}