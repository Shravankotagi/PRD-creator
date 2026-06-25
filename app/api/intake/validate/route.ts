import { NextRequest, NextResponse } from "next/server";
import { validateAnswerRelevance } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question, answer, previousAnswers, shouldClarify } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ isValid: true, isSufficient: true });
    }

    const result = await validateAnswerRelevance(question, answer, previousAnswers, shouldClarify);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Validate error:", err);
    return NextResponse.json({ isValid: true, isSufficient: true });
  }
}
