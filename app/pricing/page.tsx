import { PricingCard } from "@/components/PricingCard";
import { getUserPlan } from "@/lib/gating";
import { syncUserToDB } from "@/lib/auth";
import { redirect } from "next/navigation";

async function handleCheckout(priceId: string) {
  "use server";
  redirect(`/api/stripe/checkout?priceId=${priceId}`);
}

export default async function PricingPage() {
  const user = await syncUserToDB();
  const plan = user ? await getUserPlan(user.id) : "FREE";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Nav back */}
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-12"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to dashboard
        </a>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-5">
            <span className="text-indigo-400 text-xs">✦</span>
            <span className="text-xs font-medium text-indigo-300 tracking-wide">
              Pricing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            From idea to full PRD
            <br />
            <span className="text-indigo-400">in minutes</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Start free and unlock every section of your PRD — edge cases,
            assumptions, NFRs, Notion export and more — with Pro.
          </p>
        </div>

        {/* Pricing cards */}
        <PricingCard
          currentPlan={plan}
          priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ""}
        />

        {/* FAQ */}
        <div className="mt-16 max-w-xl mx-auto space-y-5">
          <h2 className="text-sm font-semibold text-slate-300 text-center mb-6 tracking-tight">
            Frequently asked questions
          </h2>

          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes — cancel from your dashboard at any time. You'll keep Pro access until the end of your billing period.",
            },
            {
              q: "What happens to my PRDs if I downgrade?",
              a: "Your sessions are saved. You'll still be able to view the free sections of previously generated PRDs.",
            },
            {
              q: "Is my payment information secure?",
              a: "Payments are processed by Stripe. We never store your card details.",
            },
            {
              q: "Do you offer a free trial?",
              a: "The free plan is available indefinitely — no credit card required. Upgrade whenever you're ready.",
            },
          ].map(({ q, a }, i) => (
            <div
              key={i}
              className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-5 py-4"
            >
              <p className="text-sm font-medium text-slate-200 mb-1.5">{q}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}