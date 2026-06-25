import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { IntakeAnswers } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, answers }: { sessionId: string; answers: IntakeAnswers } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    if (!answers || !answers.productName || !answers.problemStatement || !answers.targetUser) {
        return NextResponse.json(
         { error: "answers.productName, answers.problemStatement, and answers.targetUser are required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const intake = await prisma.intake.upsert({
      where: { sessionId },
      update: {
        productName: answers.productName,
        problemStatement: answers.problemStatement,
        targetUser: answers.targetUser,
        coreUseCases: answers.coreUseCases,
        knownConstraints: answers.knownConstraints,
        successMetrics: answers.successMetrics,
        nonGoals: answers.nonGoals,
        completedAt: new Date(),
      },
      create: {
        sessionId,
        productName: answers.productName,
        problemStatement: answers.problemStatement,
        targetUser: answers.targetUser,
        coreUseCases: answers.coreUseCases,
        knownConstraints: answers.knownConstraints,
        successMetrics: answers.successMetrics,
        nonGoals: answers.nonGoals,
        completedAt: new Date(),
      },
    });
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "GENERATING" },
    });

    return NextResponse.json({ intake }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/intake]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}