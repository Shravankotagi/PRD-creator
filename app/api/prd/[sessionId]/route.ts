import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { getUserPlan, gatePRD } from "@/lib/gating";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userId },
      include: { prd: true, user: true, intake: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!session.prd) {
      return NextResponse.json(
        { error: "PRD not generated yet for this session" },
        { status: 404 }
      );
    }

    const plan = await getUserPlan(session.user.id, sessionId, session.user, session);

    // Map Prisma field names → PRD type field names
    const mappedPRD = {
      executiveSummary: session.prd.executiveSummary ?? "",
      userStories: (session.prd.userStories ?? []) as any,
      functionalRequirements: (session.prd.functionalReqs ?? []) as any,
      nonFunctionalRequirements: (session.prd.nonFunctionalReqs ?? []) as any,
      outOfScope: (session.prd.outOfScope ?? []) as any,
      assumptions: (session.prd.assumptions ?? []) as any,
      openQuestions: (session.prd.openQuestions ?? []) as any,
      edgeCases: (session.prd.edgeCases ?? []) as any,
      techStack: (session.prd.techStack ?? null) as any,
      timeline: (session.prd.timeline ?? []) as any,
      glossary: (session.prd.glossary ?? []) as any,
      versionHistory: (session.prd.versionHistory ?? []) as any,
      stakeholders: (session.prd.stakeholders ?? []) as any,
      successMetrics: (session.prd.successMetrics ?? []) as any,
    };

    const gatedPRD = gatePRD(mappedPRD, plan);

    return NextResponse.json({
      prd: gatedPRD,
      plan,
      productName: session.intake?.productName ?? "Product Requirements Document",
      createdAt: session.prd.createdAt,
      status: session.status,
    }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/prd/[sessionId]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params;

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userId },
    });

    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.session.delete({ where: { id: sessionId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}