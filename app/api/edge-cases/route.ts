import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { generateEdgeCases } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId }: { sessionId: string } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userId },
      include: { intake: true, prd: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!session.intake) {
      return NextResponse.json(
        { error: "Intake not completed for this session" },
        { status: 400 }
      );
    }

    if (!session.prd) {
      return NextResponse.json(
        { error: "PRD not generated yet for this session" },
        { status: 400 }
      );
    }

    const newEdgeCases = await generateEdgeCases({
      productName: session.intake.productName ?? "",
      problemStatement: session.intake.problemStatement ?? "",
      targetUser: session.intake.targetUser ?? "",
      coreUseCases: session.intake.coreUseCases ?? "",
    });

    const existingEdgeCases = Array.isArray(session.prd.edgeCases)
      ? (session.prd.edgeCases as any[])
      : [];

    const mergedEdgeCases = [...existingEdgeCases, ...newEdgeCases];

    const updatedPRD = await prisma.pRD.update({
      where: { sessionId },
      data: {
        edgeCases: mergedEdgeCases,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ edgeCases: mergedEdgeCases, prd: updatedPRD }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/edge-cases]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}