import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

import { generatePRD, generateEdgeCases } from "@/lib/gemini";

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
      include: { intake: true },
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

    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "GENERATING" },
    });

    const raw = await generatePRD({
      productName: session.intake.productName ?? "",
      problemStatement: session.intake.problemStatement ?? "",
      targetUser: session.intake.targetUser ?? "",
      coreUseCases: session.intake.coreUseCases ?? "",
      knownConstraints: session.intake.knownConstraints ?? "",
      successMetrics: session.intake.successMetrics ?? "",
      nonGoals: session.intake.nonGoals ?? "",
    });

    const parsed = JSON.parse(raw);

    const edgeRaw = await generateEdgeCases({
      productName: session.intake.productName ?? "",
      problemStatement: session.intake.problemStatement ?? "",
      targetUser: session.intake.targetUser ?? "",
      coreUseCases: session.intake.coreUseCases ?? "",
    });

    const edgeParsed = JSON.parse(edgeRaw);

    const prd = await prisma.pRD.upsert({
      where: { sessionId },
      update: {
        executiveSummary: parsed.executiveSummary,
        userStories: parsed.userStories,
        functionalReqs: parsed.functionalRequirements,
        nonFunctionalReqs: parsed.nonFunctionalRequirements,
        outOfScope: parsed.outOfScope,
        assumptions: parsed.assumptions,
        openQuestions: parsed.openQuestions,
        edgeCases: edgeParsed,
        techStack: parsed.techStack,
        timeline: parsed.timeline,
        glossary: parsed.glossary,
        versionHistory: parsed.versionHistory,
        stakeholders: parsed.stakeholders,
        successMetrics: parsed.successMetrics,
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        executiveSummary: parsed.executiveSummary,
        userStories: parsed.userStories,
        functionalReqs: parsed.functionalRequirements,
        nonFunctionalReqs: parsed.nonFunctionalRequirements,
        outOfScope: parsed.outOfScope,
        assumptions: parsed.assumptions,
        openQuestions: parsed.openQuestions,
        edgeCases: edgeParsed,
        techStack: parsed.techStack,
        timeline: parsed.timeline,
        glossary: parsed.glossary,
        versionHistory: parsed.versionHistory,
        stakeholders: parsed.stakeholders,
        successMetrics: parsed.successMetrics,
      },
    });

    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "REVIEW" },
    });

    return NextResponse.json({ prd }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/generate-prd]", error);

    if (typeof error === "object" && error !== null && "sessionId" in error) {
      const { sessionId } = error as { sessionId: string };
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}