"use client";

import React, { useEffect, useRef, useState } from "react";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { StreamingText } from "@/components/StreamingText";
import { IntakeAnswers } from "@/types/session";

// ─── Step definitions ─────────────────────────────────────────────────────────

interface Step {
  id: number;
  field: keyof IntakeAnswers;
  question: string;
  placeholder: string;
  clarifyingHint?: string;
  multiline?: boolean;
  isArray?: boolean;
}

const STEPS: Step[] = [
  {
    id: 1,
    field: "productName",
    question: "What's the name of your product or feature?",
    placeholder: "e.g. Acme Checkout, Notification Centre…",
  },
  {
    id: 2,
    field: "problemStatement",
    question: "What problem does it solve? Describe it in your own words.",
    placeholder: "Users struggle with… / Teams spend too long on…",
    multiline: true,
    clarifyingHint: "Be as specific as possible — who feels the pain and when?",
  },
  {
    id: 3,
    field: "targetAudience",
    question: "Who is the primary target audience?",
    placeholder: "e.g. B2B SaaS PMs, early-stage founders, enterprise devs…",
    clarifyingHint: "Think demographics, job role, technical level.",
  },
  {
    id: 4,
    field: "goals",
    question: "What are the main goals you want this product to achieve?",
    placeholder: "Reduce churn by 20%, cut support tickets, improve onboarding…",
    multiline: true,
    isArray: true,
    clarifyingHint: "List one goal per line — we'll turn these into success criteria.",
  },
  {
    id: 5,
    field: "existingSolutions",
    question: "Are there any existing solutions or competitors you're aware of?",
    placeholder: "Notion, Jira, internal spreadsheets… or 'none'",
    multiline: true,
    clarifyingHint: "What do users currently use instead? What's missing from those?",
  },
  {
    id: 6,
    field: "constraints",
    question: "Any constraints — technical, time, budget, team size?",
    placeholder: "MVP in 6 weeks, no mobile app, 2 engineers, no external APIs…",
    multiline: true,
    clarifyingHint: "Constraints help us scope the PRD realistically.",
  },
  {
    id: 7,
    field: "successMetrics",
    question: "How will you measure success? What does 'done' look like?",
    placeholder: "NPS > 40, <2s load time, 1000 signups in month 1…",
    multiline: true,
    clarifyingHint: "Think quantitative KPIs — the more specific, the better.",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Message =
  | { role: "ai"; text: string; streaming?: boolean }
  | { role: "user"; text: string };

interface IntakeChatProps {
  sessionId: string;
  onComplete: (answers: IntakeAnswers) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseArrayAnswer(raw: string): string[] {
  return raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IntakeChat({ sessionId, onComplete }: IntakeChatProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<IntakeAnswers>>({});
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: STEPS[0].question, streaming: true },
  ]);
  const [input, setInput] = useState("");
  const [clarifyMode, setClarifyMode] = useState(false);
  const [clarifyAnswer, setClarifyAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [streamingDone, setStreamingDone] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const step = STEPS[currentStep - 1];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (streamingDone) inputRef.current?.focus();
  }, [streamingDone]);

  function pushAI(text: string) {
    setStreamingDone(false);
    setMessages((prev) => [...prev, { role: "ai", text, streaming: true }]);
  }

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || submitting) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    // Check if it's a clarifying question from user
    if (trimmed.endsWith("?") && step.clarifyingHint) {
      setClarifyMode(true);
      setClarifyAnswer(trimmed);
      pushAI(step.clarifyingHint);
      return;
    }

    // Save answer
    const value: string | string[] = step.isArray
      ? parseArrayAnswer(trimmed)
      : trimmed;

    const updatedAnswers = { ...answers, [step.field]: value };
    setAnswers(updatedAnswers);

    if (currentStep < STEPS.length) {
      const next = STEPS[currentStep];
      setCurrentStep((s) => s + 1);
      pushAI(next.question);
      setClarifyMode(false);
    } else {
      // All steps done
      setSubmitting(true);
      const finalAnswers: IntakeAnswers = {
        productName: updatedAnswers.productName ?? "",
        problemStatement: updatedAnswers.problemStatement ?? "",
        targetAudience: updatedAnswers.targetAudience ?? "",
        goals: (updatedAnswers.goals as string[]) ?? [],
        existingSolutions: updatedAnswers.existingSolutions as string,
        constraints: updatedAnswers.constraints as string,
        successMetrics: updatedAnswers.successMetrics as string,
      };
      pushAI(
        "Perfect — that's everything I need. Generating your PRD now… ✨"
      );
      setTimeout(() => onComplete(finalAnswers), 1400);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const isLastStep = currentStep === STEPS.length;
  const currentStepDef = STEPS[currentStep - 1];

  return (
    <div className="flex flex-col h-full min-h-[600px] max-w-2xl mx-auto">
      {/* Progress */}
      <div className="px-4 pt-6 pb-4 border-b border-slate-800">
        <ProgressIndicator currentStep={currentStep} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => {
          const isLastAI = msg.role === "ai" && i === messages.length - 1;

          return (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-indigo-400 text-xs">✦</span>
                </div>
              )}

              <div
                className={[
                  "max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "ai"
                    ? "bg-slate-800/70 text-slate-100 rounded-tl-sm border border-slate-700/50"
                    : "bg-indigo-600 text-white rounded-tr-sm",
                ].join(" ")}
              >
                {msg.role === "ai" && msg.streaming && isLastAI ? (
                  <StreamingText
                    text={msg.text}
                    speed={16}
                    onComplete={() => setStreamingDone(true)}
                  />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          );
        })}

        {/* Clarifying hint tag */}
        {streamingDone && currentStepDef.clarifyingHint && !clarifyMode && (
          <div className="flex justify-start pl-10">
            <button
              onClick={() => {
                pushAI(currentStepDef.clarifyingHint!);
                setClarifyMode(true);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-3 py-1.5 rounded-full transition-colors duration-200"
            >
              💡 Need a hint?
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-slate-800">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={submitting || !streamingDone}
              rows={currentStepDef.multiline ? 3 : 1}
              placeholder={streamingDone ? currentStepDef.placeholder : ""}
              className={[
                "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3",
                "text-sm text-slate-100 placeholder-slate-500 resize-none",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50",
                "transition-all duration-200 leading-relaxed",
                "disabled:opacity-40 disabled:cursor-not-allowed",
              ].join(" ")}
            />
            <p className="absolute bottom-2 right-3 text-[10px] text-slate-600 select-none">
              {currentStepDef.multiline ? "Shift+Enter for newline" : "Enter to send"}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || submitting || !streamingDone}
            className={[
              "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center",
              "bg-indigo-600 hover:bg-indigo-500 active:scale-95",
              "transition-all duration-150",
              "disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100",
            ].join(" ")}
          >
            {submitting ? (
              <svg
                className="w-4 h-4 text-white animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3.105 3.105a1 1 0 011.3-.1l13 8a1 1 0 010 1.69l-13 8a1 1 0 01-1.4-1.3L4.68 11H11a1 1 0 000-2H4.68L3.005 4.405a1 1 0 01.1-1.3z" />
              </svg>
            )}
          </button>
        </div>

        {/* Step label */}
        <p className="text-center text-[11px] text-slate-600 mt-3">
          {isLastStep
            ? "Last step — almost there!"
            : `${STEPS.length - currentStep} question${STEPS.length - currentStep === 1 ? "" : "s"} remaining`}
        </p>
      </div>
    </div>
  );
}