import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "better-auth/crypto";

function normalizePhone(p: string): string {
  const digits = p.replace(/\D/g, ""); // Keep only digits
  return digits.slice(-10); // Match last 10 digits to handle country code prefix mismatches
}

export async function POST(req: NextRequest) {
  try {
    const { email, phone, newPassword } = await req.json();

    if (!email || !phone || !newPassword) {
      return NextResponse.json({ error: "Email, phone number, and new password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User with this email was not found" }, { status: 400 });
    }

    if (!user.phone) {
      return NextResponse.json({ error: "No phone number is registered for this account" }, { status: 400 });
    }

    // Verify phone number matches
    if (normalizePhone(user.phone) !== normalizePhone(phone)) {
      return NextResponse.json({ error: "The provided phone number does not match our records for this email address" }, { status: 400 });
    }

    // Find local credential account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
    });

    if (!account) {
      return NextResponse.json({
        error: "This account was registered using a social provider (Google/Notion) and does not have a local password to reset.",
      }, { status: 400 });
    }

    // Hash the new password using Better Auth's hashing algorithm
    const hashedPassword = await hashPassword(newPassword);

    // Update account password
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    console.error("Password reset error:", err);
    return NextResponse.json({ error: err.message || "Failed to reset password" }, { status: 500 });
  }
}
