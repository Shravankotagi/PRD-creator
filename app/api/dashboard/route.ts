import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        prd: {
          select: {
            id: true,
            sessionId: true,
            executiveSummary: true,
            createdAt: true,
          },
        },
        intake: {
          select: {
            productName: true,
            problemStatement: true,
          },
        },
      },
    });

    // Map to match what dashboard page expects
    const mapped = sessions.map(s => ({
      id: s.id,
      createdAt: s.createdAt,
      status: s.status,
      prd: s.prd ? {
        id: s.id, // page redirects to /prd/[sessionId]
        title: s.intake?.productName ?? "Untitled PRD",
        createdAt: s.prd.createdAt,
      } : undefined,
      intake: s.intake ? {
        answers: {
          product_name: s.intake.productName ?? "",
          problem_statement: s.intake.problemStatement ?? "",
        },
      } : undefined,
    }));

    const plan = user.plan;
    return NextResponse.json({ sessions: mapped, plan });
  } catch (error) {
    console.error("[GET /api/dashboard]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}