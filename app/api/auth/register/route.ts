import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json({ error: "Only Gmail addresses (@gmail.com) are allowed" }, { status: 400 });
    }

    // Validate email uniqueness
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Validate phone uniqueness
    const existingPhone = await (prisma.user as any).findFirst({
      where: { phone },
    });
    if (existingPhone) {
      return NextResponse.json({ error: "Phone number is already registered" }, { status: 400 });
    }

    // Register user via Better Auth
    const authRes = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      asResponse: true,
    });

    if (!authRes.ok) {
      const errData = await authRes.json();
      return NextResponse.json({ error: errData.message || "Failed to register" }, { status: authRes.status });
    }

    
    // Update user phone number in the database
    let updated = false;
    for (let i = 0; i < 5; i++) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await (prisma.user as any).update({
          where: { email },
          data: { phone },
        });
        updated = true;
        break;
      }
      await new Promise(res => setTimeout(res, 300));
    }
    if (!updated) {
      console.warn("Could not update phone for:", email);
    }

    // Return the response (fowarding the Better Auth cookies and session data)
    return authRes;
  } catch (err: any) {
    console.error("Registration endpoint error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
