import { getAuthUserId } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionStatus, Plan } from "@prisma/client";

export async function POST() {
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

    let sessionPlan: Plan = Plan.FREE;

    if (user.plan === Plan.PAID) {
      sessionPlan = Plan.FREE; // Dynamically resolved to PAID via getUserPlan
    } else if (user.proSessionsLeft > 0) {
      sessionPlan = Plan.PAID;
      await prisma.user.update({
        where: { id: userId },
        data: { proSessionsLeft: { decrement: 1 } },
      });
    } else if (user.freeSessionsLeft > 0) {
      sessionPlan = Plan.FREE;
      await prisma.user.update({
        where: { id: userId },
        data: { freeSessionsLeft: { decrement: 1 } },
      });
    } else {
      return NextResponse.json(
        { error: "LIMIT_REACHED", message: "You have used all trial sessions. Upgrade to PRO to continue." },
        { status: 403 }
      );
    }

    const session = await prisma.session.create({
      data: {
        userId: userId,
        status: SessionStatus.IN_PROGRESS,
        plan: sessionPlan,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Session create error:", err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}