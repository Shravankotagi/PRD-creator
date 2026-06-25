import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (sessionId) {
      const session = await prisma.session.findFirst({
        where: { id: sessionId, userId: userId },
        include: { user: true, intake: true },
      });

      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      return NextResponse.json({ session });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: userId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("[GET /api/sessions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { intake, prd, status, notionPageUrl } = body;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const session = await prisma.session.create({
      data: {
        userId: dbUser.id,
        intake: intake ?? undefined,
        prd: prd ?? undefined,
        status: status ?? "intake",
        notionPageUrl: notionPageUrl ?? null,
      },
      include: { user: true },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sessions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}