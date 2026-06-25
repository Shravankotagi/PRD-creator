"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingFeature {
  label: string;
  included: boolean;
}

interface PricingCardProps {
  currentPlan: "FREE" | "PAID";
  priceId: string;
  onCheckout?: (priceId: string) => Promise<void>;
}


// ─── Feature lists ────────────────────────────────────────────────────────────

const FREE_FEATURES: PricingFeature[] = [
  { label: "Executive Summary", included: true },
  { label: "User Stories", included: true },
  { label: "Functional Requirements", included: true },
  { label: "PDF Export", included: true },
  { label: "Non-Functional Requirements", included: false },
  { label: "Out of Scope", included: false },
  { label: "Assumptions", included: false },
  { label: "Open Questions", included: false },
  { label: "Edge Cases", included: false },
  { label: "Notion Export", included: false },
];

const PAID_FEATURES: PricingFeature[] = [
  { label: "Executive Summary", included: true },
  { label: "User Stories", included: true },
  { label: "Functional Requirements", included: true },
  { label: "PDF Export", included: true },
  { label: "Non-Functional Requirements", included: true },
  { label: "Out of Scope", included: true },
  { label: "Assumptions", included: true },
  { label: "Open Questions", included: true },
  { label: "Edge Cases", included: true },
  { label: "Notion Export", included: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureRow({ feature }: { feature: PricingFeature }) {
  return (
    <li className="flex items-center gap-3">
      {feature.included ? (
        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-indigo-400" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-700/50 border border-slate-600/30 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-slate-600" viewBox="0 0 10 10" fill="none">
            <path
              d="M2.5 2.5l5 5M7.5 2.5l-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      <span
        className={`text-sm ${
          feature.included ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {feature.label}
      </span>
    </li>
  );
}

function PlanBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${
        active
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-slate-700/40 border-slate-600/30 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}

// ─── Free Card ────────────────────────────────────────────────────────────────

function FreeCard({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        isCurrent
          ? "bg-slate-800/60 border-slate-600"
          : "bg-slate-800/30 border-slate-700/50"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-200">Free</h3>
          <p className="text-xs text-slate-500 mt-0.5">Get started instantly</p>
        </div>
        {isCurrent && <PlanBadge label="Current" active={false} />}
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-white">$0</span>
        <span className="text-sm text-slate-500 ml-1">/ forever</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {FREE_FEATURES.map((f, i) => (
          <FeatureRow key={i} feature={f} />
        ))}
      </ul>

      <button
        disabled
        className="w-full py-2.5 rounded-xl text-sm font-medium bg-slate-700/50 text-slate-500 border border-slate-600/30 cursor-not-allowed"
      >
        {isCurrent ? "Your current plan" : "Free forever"}
      </button>
    </div>
  );
}

// ─── Paid Card ────────────────────────────────────────────────────────────────

function PaidCard({
  isCurrent,
  priceId,
  onCheckout,
}: {
  isCurrent: boolean;
  priceId: string;
  onCheckout?: (priceId: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpgrade() {
    if (isCurrent) return;
    setLoading(true);
    setError(null);
    try {
      if (onCheckout) {
        await onCheckout(priceId);
      } else {
        router.push("/checkout");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col rounded-2xl border p-6 bg-indigo-950/40 border-indigo-500/30 shadow-[0_0_40px_-8px_rgba(99,102,241,0.2)]">
      {/* Popular badge */}
      {!isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Pro</h3>
          <p className="text-xs text-indigo-300/70 mt-0.5">Full PRD generation</p>
        </div>
        {isCurrent && <PlanBadge label="Active" active={true} />}
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-white">$19</span>
        <span className="text-sm text-slate-400 ml-1">/ month</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {PAID_FEATURES.map((f, i) => (
          <FeatureRow key={i} feature={f} />
        ))}
      </ul>

      {error && (
        <p className="text-xs text-red-400 mb-3 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}

      <button
        onClick={handleUpgrade}
        disabled={isCurrent || loading}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isCurrent
            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-default"
            : loading
            ? "bg-indigo-600/60 text-white/60 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98] shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] hover:shadow-[0_4px_20px_0_rgba(99,102,241,0.5)]"
        }`}
      >
        {isCurrent ? (
          "✓ You're on Pro"
        ) : loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Redirecting…
          </span>
        ) : (
          "Upgrade to Pro →"
        )}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PricingCard({
  currentPlan,
  priceId,
  onCheckout,
}: PricingCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Start for free. Upgrade when you need the full PRD.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
        <FreeCard isCurrent={currentPlan === "FREE"} />
        <PaidCard
          isCurrent={currentPlan === "PAID"}
          priceId={priceId}
          onCheckout={onCheckout}
        />
      </div>

      <p className="text-center text-xs text-slate-600 mt-6">
        Payments secured by Stripe · Cancel anytime · No hidden fees
      </p>
    </div>
  );
}