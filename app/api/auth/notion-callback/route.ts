import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { exchangeNotionCode } from "@/lib/notion";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("[Notion OAuth] Error from Notion:", error);
      return NextResponse.redirect(
        new URL(`/dashboard?notion_error=${encodeURIComponent(error)}`, req.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/dashboard?notion_error=missing_code", req.url)
      );
    }

    const tokenData = await exchangeNotionCode(code);

    if (!tokenData?.access_token) {
      console.error("[Notion OAuth] Failed to exchange code:", tokenData);
      return NextResponse.redirect(
        new URL("/dashboard?notion_error=token_exchange_failed", req.url)
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.redirect(
        new URL("/dashboard?notion_error=user_not_found", req.url)
      );
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        notionAccessToken: tokenData.access_token,
        notionWorkspaceId: tokenData.workspace_id ?? null,
        notionWorkspaceName: tokenData.workspace_name ?? null,
        notionBotId: tokenData.bot_id ?? null,
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard?notion_connected=true", req.url)
    );
  } catch (error) {
    console.error("[GET /api/auth/notion-callback]", error);
    return NextResponse.redirect(
      new URL("/dashboard?notion_error=server_error", req.url)
    );
  }
}