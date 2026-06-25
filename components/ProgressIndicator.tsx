"use client";

import React from "react";

const STEPS = [
  { id: 1, label: "Product" },
  { id: 2, label: "Problem" },
  { id: 3, label: "Audience" },
  { id: 4, label: "Goals" },
  { id: 5, label: "Solutions" },
  { id: 6, label: "Constraints" },
  { id: 7, label: "Metrics" },
];

interface ProgressIndicatorProps {
  currentStep: number; // 1-indexed
  className?: string;
}

export function ProgressIndicator({ currentStep, className = "" }: ProgressIndicatorProps) {
  const clampedStep = Math.min(Math.max(currentStep, 1), STEPS.length);
  const progressPercent = ((clampedStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Step counter */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400">
          Step {clampedStep} of {STEPS.length}
        </p>
        <p className="text-xs text-slate-400">
          {STEPS[clampedStep - 1].label}
        </p>
      </div>

      {/* Track + nodes */}
      <div className="relative flex items-center">
        {/* Background track */}
        <div className="absolute left-0 right-0 h-[2px] bg-slate-700/60 rounded-full" />

        {/* Filled track */}
        <div
          className="absolute left-0 h-[2px] bg-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Step nodes */}
        <div className="relative flex justify-between w-full">
          {STEPS.map((step) => {
            const isCompleted = step.id < clampedStep;
            const isCurrent = step.id === clampedStep;
            const isPending = step.id > clampedStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                {/* Node */}
                <div
                  className={[
                    "relative flex items-center justify-center rounded-full transition-all duration-300",
                    isCompleted
                      ? "w-5 h-5 bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                      : isCurrent
                      ? "w-6 h-6 bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.2)] ring-2 ring-indigo-400/60"
                      : "w-5 h-5 bg-slate-700 border border-slate-600",
                  ].join(" ")}
                >
                  {isCompleted && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={[
                    "text-[10px] font-medium tracking-wide transition-colors duration-300 hidden sm:block",
                    isCompleted
                      ? "text-indigo-400"
                      : isCurrent
                      ? "text-white"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}