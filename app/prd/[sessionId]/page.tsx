"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { PRDDocument } from "@/components/PRDDocument";
import BrandLogo from "@/components/BrandLogo";

interface PRDResponse {
  prd: any;
  plan: "FREE" | "PAID";
  productName: string;
  createdAt: string;
  status?: string;
}

export default function PRDPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoaded = !isPending;
  const router = useRouter();
  const params = useParams();
  const prdId = params?.sessionId as string;

  const [prd, setPrd] = useState<any | null>(null);
  const [plan, setPlan] = useState<"FREE" | "PAID">("FREE");
  const [productName, setProductName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [status, setStatus] = useState<string>("REVIEW");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"pdf" | "notion" | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    let active = true;
    
    fetch(`/api/prd/${prdId}`)
      .then((r) => {
        if (r.status === 401) {
          router.push("/sign-in");
          throw new Error("Unauthorized");
        }
        if (!r.ok) {
          throw new Error("Failed to load PRD");
        }
        return r.json();
      })
      .then((data: PRDResponse) => {
        if (!active) return;
        setPrd(data.prd);
        setPlan(data.plan);
        setProductName(data.productName);
        setCreatedAt(data.createdAt);
        if (data.status) setStatus(data.status);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        if (err.message !== "Unauthorized") {
          console.error(err);
          setError("Failed to load your Product Requirements Document.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [prdId, router]);

  const handleAcceptPRD = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/session/${prdId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      if (res.ok) {
        setStatus("ACCEPTED");
      }
    } catch (err) {
      console.error("Failed to accept PRD", err);
    } finally {
      setAccepting(false);
    }
  };

  const isPaid = plan === "PAID";

  const handleUpgrade = async () => {
    router.push(`/checkout?sessionId=${prdId}`);
  };

  const handlePDFExport = async () => {
    if (!isPaid) return;
    setExporting("pdf");
    try {
      const res = await fetch(`/api/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: prdId }),
      });
      if (res.status === 402) {
        alert("Upgrade to PRO is required to export.");
        return;
      }
      if (!res.ok) throw new Error();
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PRD-${productName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setExporting(null);
    }
  };

  const handleNotionExport = async () => {
    if (!isPaid) return;
    setExporting("notion");
    try {
      const res = await fetch(`/api/export/notion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: prdId }),
      });
      const data = await res.json();
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      } else if (data.notionPageUrl) {
        window.open(data.notionPageUrl, "_blank");
      }
    } catch (err) {
      console.error("Notion export failed", err);
    } finally {
      setExporting(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-el-bg">
        <div className="w-9 h-9 border-2 border-el-blue border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm text-el-body font-medium">Loading your PRD...</span>
      </div>
    );
  }

  if (error || !prd) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-el-bg p-6 text-center">
        <span className="text-3xl mb-4">⚠️</span>
        <h2 className="text-lg font-bold text-el-heading mb-2">Failed to load PRD</h2>
        <p className="text-sm text-el-body max-w-sm mb-6">{error || "Please try again later."}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-el-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-el-blue-dark transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-el-bg font-sans antialiased text-el-heading flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-el-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo href="/dashboard" />

          <div className="flex items-center gap-3">
            {isPaid ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                ✦ PRO
              </span>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="bg-el-blue text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-el-blue-dark transition shadow-el-blue disabled:opacity-50"
              >
                {upgrading ? "Loading..." : "Upgrade for $10"}
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-slate-50 border border-el-border rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="avatar"
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-el-blue text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-el-body hidden sm:inline">
                  {user?.name ? user.name.split(" ")[0] : ""}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`text-el-muted transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-el-border rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-el-border">
                      <p className="text-xs font-bold text-el-navy truncate">{user?.name}</p>
                      <p className="text-[10px] text-el-muted truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-el-body hover:bg-slate-50 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-el-muted">
                        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                      Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        await authClient.signOut();
                        router.push("/sign-in");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400">
                        <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Title Block Card */}
        <div className="bg-white border border-el-border rounded-2xl p-6 sm:p-8 mb-8 shadow-el-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-el-blue bg-el-blue-light border border-blue-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              PRD {prd.version && prd.version > 1 ? `v${prd.version}` : ""}
            </span>
            <span className="text-xs text-el-muted">
              Generated {new Date(createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-el-navy tracking-tight leading-tight mb-4">
            {productName}
          </h1>

          <p className="text-sm text-el-body leading-relaxed mb-6">
            Review the product requirements, user stories, functional requirements, and edge cases generated for your engineering team.
          </p>

          {/* Action buttons (responsive wrap) */}
          <div className="flex flex-wrap items-center gap-3">
            {status === "ACCEPTED" ? (
              <button
                disabled
                className="flex items-center justify-center gap-2 border border-emerald-200 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex-1 sm:flex-none shadow-sm cursor-default"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Accepted
              </button>
            ) : (
              <button
                onClick={handleAcceptPRD}
                disabled={accepting}
                className="flex items-center justify-center gap-2 border border-emerald-600 text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex-1 sm:flex-none shadow-sm"
              >
                {accepting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                Accept PRD
              </button>
            )}

            <button
              onClick={() => router.push(`/intake?sessionId=${prdId}`)}
              disabled={status === "ACCEPTED"}
              className={`flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex-1 sm:flex-none shadow-sm
                ${status === "ACCEPTED" 
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed" 
                  : "border-el-blue text-el-blue bg-white hover:bg-el-blue-light/50 cursor-pointer"
                }
              `}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Modify & Regenerate
            </button>

            <button
              onClick={handlePDFExport}
              disabled={!isPaid || exporting === "pdf"}
              className={`flex items-center justify-center gap-2 border border-el-border px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex-1 sm:flex-none shadow-sm
                ${isPaid ? "bg-white hover:bg-slate-50 text-el-body cursor-pointer" : "bg-slate-50 text-el-muted cursor-not-allowed"}
              `}
            >
              {exporting === "pdf" ? (
                <div className="w-3.5 h-3.5 border-2 border-el-blue border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              )}
              PDF {!isPaid && <span className="text-[9px] text-amber-500 font-bold bg-amber-50 border border-amber-200 px-1.5 rounded-full ml-1">PRO</span>}
            </button>

            <button
              onClick={handleNotionExport}
              disabled={!isPaid || exporting === "notion"}
              className={`flex items-center justify-center gap-2 border border-el-border px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex-1 sm:flex-none shadow-sm
                ${isPaid ? "bg-white hover:bg-slate-50 text-el-body cursor-pointer" : "bg-slate-50 text-el-muted cursor-not-allowed"}
              `}
            >
              {exporting === "notion" ? (
                <div className="w-3.5 h-3.5 border-2 border-el-blue border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 17V7M9 10h6M9 13h4"/>
                </svg>
              )}
              Notion {!isPaid && <span className="text-[9px] text-amber-500 font-bold bg-amber-50 border border-amber-200 px-1.5 rounded-full ml-1">PRO</span>}
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 border border-el-border bg-white hover:bg-slate-50 text-el-body px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex-1 sm:flex-none shadow-sm"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* PRD Document details */}
        <div className="w-full">
          <PRDDocument
            productName={productName}
            prd={prd}
            plan={plan}
            onUpgrade={handleUpgrade}
          />
        </div>
      </main>
    </div>
  );
}