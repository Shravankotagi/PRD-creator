"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BrandLogo from "@/components/BrandLogo";

export default function CheckoutPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [backUrl, setBackUrl] = useState("/dashboard");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const sid = searchParams.get("sessionId");
      if (sid) {
        setBackUrl(`/prd/${sid}`);
      }
    }
  }, []);

  // Format card number: Add spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{1,4}/g);
    setCardNumber(matches ? matches.join(" ") : value);
  };

  // Format expiry: MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  // Format CVV: Max 3 or 4 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (cardNumber.replace(/\s/g, "").length < 15) {
      setError("Please enter a valid credit card number.");
      return;
    }
    if (expiry.length < 5) {
      setError("Please enter a valid expiration date (MM/YY).");
      return;
    }
    if (cvv.length < 3) {
      setError("Please enter a valid CVV code.");
      return;
    }
    if (!cardName.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    setIsProcessing(true);
    setProcessStep(0);

    // Simulate steps of transaction processing
    const steps = [
      "Contacting secure gateway...",
      "Authorizing payment details...",
      "Activating PRO plan features...",
      "Finalizing setup..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessStep(i + 1);
    }

    try {
      const res = await fetch("/api/payment/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error("Upgrade request failed.");
      }

      // Success redirect
      router.push("/dashboard?checkout=success");
    } catch (err) {
      setError("Payment simulation succeeded but upgrading database failed. Please contact support.");
      setIsProcessing(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-el-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-700 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const stepsText = [
    "Contacting secure gateway...",
    "Authorizing payment details...",
    "Activating PRO plan features...",
    "Finalizing setup..."
  ];

  return (
    <main className="min-h-screen bg-el-bg px-4 py-8 md:py-16 relative overflow-hidden flex items-center justify-center">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        {/* Left Side: Order Summary */}
        <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
          <div>
            <div className="mb-8 flex justify-center md:justify-start">
              <BrandLogo href={backUrl} />
            </div>
            
            <h2 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">PRD Creator Pro</h3>
                  <p className="text-xs text-slate-500 mt-1">Lifetime Premium Access</p>
                </div>
                <span className="text-sm font-bold text-slate-800">$10.00</span>
              </div>

              <ul className="space-y-2.5 pt-2">
                {[
                  "Unlimited full PRD generations",
                  "Edge case & open question detection",
                  "Download PRDs as high-quality PDF",
                  "Instant sync to Notion workspaces",
                  "Comprehensive Non-Functional Requirements"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="text-blue-700 font-bold">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">Subtotal</span>
              <span className="text-xs text-slate-700 font-medium">$10.00</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-slate-500">Tax</span>
              <span className="text-xs text-slate-700 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800">Total due</span>
              <span className="text-lg font-bold text-blue-700">$10.00</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full md:w-7/12 p-6 md:p-10 relative bg-white">
          {isProcessing ? (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-blue-700 border-r-blue-700 rounded-full animate-spin" />
                <span className="text-blue-700 text-lg">✦</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Simulating Secure Payment</h3>
              <div className="space-y-1">
                {stepsText.map((step, index) => (
                  <p
                    key={index}
                    className={`text-sm transition-all duration-300 ${
                      processStep > index
                        ? "text-emerald-600 font-bold"
                        : processStep === index
                        ? "text-blue-700 animate-pulse font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {processStep > index ? "✓ " : "• "}{step}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded font-bold">
                    Demo Mode Enabled
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-6">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Stripe registration is currently restricted in India. To enable testing and demoing, this system uses a simulated checkout. You can fill the fields with any mock data to proceed.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none font-semibold"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">VISA</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none text-center font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="•••"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none text-center font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-blue-700/10 active:scale-[0.98] transition-all duration-200"
                >
                  Pay $10.00 & Upgrade
                </button>
              </form>
            </div>

            <div className="mt-8 flex justify-center items-center gap-4 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                🔒 SSL Secure 256-bit
              </span>
              <span>•</span>
              <span>🔒 Demo payment environment</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
