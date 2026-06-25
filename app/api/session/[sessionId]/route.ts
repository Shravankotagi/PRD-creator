import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params;
    const { status } = await req.json();

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: userId },
    });

    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data: { status },
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}