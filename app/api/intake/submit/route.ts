import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { generatePRD, generateEdgeCases } from "@/lib/gemini";

// Strips markdown code fences Gemini sometimes adds despite instructions
function cleanJSON(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, answers } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    if (!answers) {
      return NextResponse.json({ error: "answers are required" }, { status: 400 });
    }

    // Map frontend answer keys → Prisma Intake field names
    const mappedAnswers = {
      productName:      answers.product_name        || answers.productName       || "",
      problemStatement: answers.problem_statement   || answers.problemStatement  || "",
      targetUser:       answers.target_users        || answers.targetUser        || "",
      coreUseCases:     answers.core_features       || answers.coreUseCases      || "",
      successMetrics:   answers.success_metrics     || answers.successMetrics    || "",
      knownConstraints: answers.constraints         || answers.knownConstraints  || "",
      nonGoals:         answers.non_goals           || answers.nonGoals          || answers.competitive_landscape || "",
    };

    if (!mappedAnswers.productName || !mappedAnswers.problemStatement || !mappedAnswers.targetUser) {
      return NextResponse.json(
        { error: "productName, problemStatement, and targetUser are required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Save intake answers
    await prisma.intake.upsert({
      where: { sessionId },
      update: { ...mappedAnswers, completedAt: new Date() },
      create: { sessionId, ...mappedAnswers, completedAt: new Date() },
    });

    // Set session to GENERATING
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "GENERATING" },
    });

    // Generate PRD — clean JSON before parsing
    const raw = await generatePRD(mappedAnswers);
    const parsed = JSON.parse(cleanJSON(raw));

    // Generate edge cases — clean JSON before parsing
    const edgeRaw = await generateEdgeCases({
      productName:      mappedAnswers.productName,
      problemStatement: mappedAnswers.problemStatement,
      targetUser:       mappedAnswers.targetUser,
      coreUseCases:     mappedAnswers.coreUseCases,
    });
    const edgeParsed = JSON.parse(cleanJSON(edgeRaw));

    // Save PRD to database
    await prisma.pRD.upsert({
      where: { sessionId },
      update: {
        executiveSummary:  parsed.executiveSummary,
        userStories:       parsed.userStories,
        functionalReqs:    parsed.functionalRequirements,
        nonFunctionalReqs: parsed.nonFunctionalRequirements,
        outOfScope:        parsed.outOfScope,
        assumptions:       parsed.assumptions,
        openQuestions:     parsed.openQuestions,
        edgeCases:         edgeParsed,
        techStack:         parsed.techStack,
        timeline:          parsed.timeline,
        glossary:          parsed.glossary,
        versionHistory:    parsed.versionHistory,
        stakeholders:      parsed.stakeholders,
        successMetrics:    parsed.successMetrics,
        updatedAt:         new Date(),
        version:           { increment: 1 },
      },
      create: {
        sessionId,
        executiveSummary:  parsed.executiveSummary,
        userStories:       parsed.userStories,
        functionalReqs:    parsed.functionalRequirements,
        nonFunctionalReqs: parsed.nonFunctionalRequirements,
        outOfScope:        parsed.outOfScope,
        assumptions:       parsed.assumptions,
        openQuestions:     parsed.openQuestions,
        edgeCases:         edgeParsed,
        techStack:         parsed.techStack,
        timeline:          parsed.timeline,
        glossary:          parsed.glossary,
        versionHistory:    parsed.versionHistory,
        stakeholders:      parsed.stakeholders,
        successMetrics:    parsed.successMetrics,
        version:           1,
      },
    });

    // Mark session complete
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "REVIEW" },
    });

    return NextResponse.json({ prdId: sessionId }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/intake/submit]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}