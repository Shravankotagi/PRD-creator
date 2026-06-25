import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { PRDDocument } from "@/lib/pdf";
import { getUserPlan, gatePRD } from "@/lib/gating";
import React from "react";

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
      include: { intake: true, prd: true, user: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!session.prd) {
      return NextResponse.json(
        { error: "PRD not generated yet for this session" },
        { status: 400 }
      );
    }

    if (!session.intake) {
      return NextResponse.json(
        { error: "Intake not found for this session" },
        { status: 400 }
      );
    }

    const plan = await getUserPlan(session.user.id, sessionId, session.user, session);
    if (plan !== "PAID") {
      return NextResponse.json({ error: "Upgrade to PRO is required to download PDF" }, { status: 402 });
    }
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

    const gatedPRD = gatePRD(mappedPRD as any, plan);

    const productName = session.intake.productName ?? "Product";

    const buffer = await renderToBuffer(
      React.createElement(PRDDocument, {
        productName,
        prd: gatedPRD as any,
        generatedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }) as any
    ) as unknown as Buffer;

    const filename = `PRD-${productName.replace(/\s+/g, "-")}-${Date.now()}.pdf`;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[POST /api/export/pdf]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
