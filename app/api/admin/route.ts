import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // Simple password protection via header
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const [audits, emailsSent] = await Promise.all([
      prisma.audit.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { emailsSent: true },
      }),
      prisma.emailCapture.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { audit: { select: { overallScore: true, shareId: true } } },
      }),
    ])

    const totalAudits    = await prisma.audit.count()
    const totalCaptures  = await prisma.emailCapture.count()
    const avgScoreResult = await prisma.audit.aggregate({ _avg: { overallScore: true } })

    return NextResponse.json({
      success: true,
      stats: {
        totalAudits,
        totalCaptures,
        avgScore:  Math.round(avgScoreResult._avg.overallScore ?? 0),
        shareRate: totalAudits > 0
          ? Math.round((totalCaptures / totalAudits) * 100)
          : 0,
      },
      audits,
      emailsSent,
    })
  } catch (err) {
    console.error('[Admin error]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}