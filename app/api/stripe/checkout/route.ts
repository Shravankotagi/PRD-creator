import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { priceId, successUrl, cancelUrl } = body;

    // Mock payment upgrade if using dummy keys or missing priceId in development
    if (
      process.env.STRIPE_SECRET_KEY === "sk_test_dummy" || 
      !process.env.STRIPE_SECRET_KEY || 
      priceId === "dummy" || 
      !priceId
    ) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { plan: "PAID" },
      });

      const redirectSuccessUrl = successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`;
      return NextResponse.json({ url: redirectSuccessUrl }, { status: 200 });
    }

    const checkoutUrl = await createCheckoutSession({
      userId: dbUser.id,
      email: dbUser.email,
      priceId,
      successUrl: successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancelUrl: cancelUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancelled`,
    });

    return NextResponse.json({ url: checkoutUrl }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/stripe/checkout]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}