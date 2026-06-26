"use client";

import Link from "next/link";
import { useState } from "react";

// Clean SVG star helper to avoid emojis in rating icons
const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Clean SVG checkmark helper for bullet lists
const CheckIcon = ({ className = "text-green-500" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function HomePage() {
  // ── STATE FOR INTERACTIVE HERO CARD ──
  const [activeTab, setActiveTab] = useState<"quality" | "stories" | "edges" | "tech" | "roadmap">("quality");

  // ── STATE FOR FAQ ACCORDION ──
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── STATE FOR INTERACTIVE HERO CURSOR GLOW ──
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setCoords({
      x: e.clientX,
      y: e.clientY
    });
  };

  // ── STATE FOR INTERACTIVE SANDBOX WIDGET ──
  const [sandboxProduct, setSandboxProduct] = useState("FlowDesk Support Inbox");
  const [customProduct, setCustomProduct] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxConsole, setSandboxConsole] = useState<string[]>([]);
  const [sandboxContent, setSandboxContent] = useState("");
  const [sandboxStage, setSandboxStage] = useState<"idle" | "parsing" | "writing" | "done">("idle");

  const runSandbox = () => {
    const targetProduct = customProduct.trim() || sandboxProduct;
    if (!targetProduct) return;

    setSandboxLoading(true);
    setSandboxStage("parsing");
    setSandboxConsole([`Initializing context analyzer for: "${targetProduct}"`]);
    setSandboxContent("");

    setTimeout(() => {
      setSandboxConsole(prev => [
        ...prev,
        `[INFO] Parsing problem statement...`,
        `[INFO] Constructing data schemas...`
      ]);
    }, 600);

    setTimeout(() => {
      setSandboxStage("writing");
      setSandboxConsole(prev => [
        ...prev,
        `[SUCCESS] Context established.`,
        `[INFO] Generating User Stories & Edge cases...`
      ]);
    }, 1400);

    setTimeout(() => {
      setSandboxStage("done");
      setSandboxLoading(false);

      let output = "";
      if (targetProduct.toLowerCase().includes("flowdesk") || targetProduct.toLowerCase().includes("support")) {
        output = `## [FOUNDATION] FlowDesk Requirements\n\n### USER STORY 1.0\nAS A Customer Support Lead,\nI WANT an aggregated inbox timeline,\nSO THAT agents retain client context.\n\n### EDGE CASE 1.1\nIF agent session drops during response dispatch,\nTHEN save draft state to local storage.`;
      } else if (targetProduct.toLowerCase().includes("dog") || targetProduct.toLowerCase().includes("walking")) {
        output = `## [FOUNDATION] Pet Tracking App\n\n### USER STORY 1.0\nAS A Dog Owner,\nI WANT real-time GPS tracking during walks,\nSO THAT I can confirm safety compliance.\n\n### EDGE CASE 1.1\nIF GPS coordinates disconnect mid-route,\nTHEN record offline route via local device sensor cache.`;
      } else {
        output = `## [FOUNDATION] AI Schedule Planner\n\n### USER STORY 1.0\nAS A Busy Executive,\nI WANT meeting coordinates sync via NLP mails,\nSO THAT scheduler schedules slots automatically.\n\n### EDGE CASE 1.1\nIF invitees have conflicting custom timezones,\nTHEN assign priority weights based on business hours.`;
      }

      // Typing simulation
      let currentLen = 0;
      const interval = setInterval(() => {
        currentLen += 8;
        setSandboxContent(output.substring(0, currentLen));
        if (currentLen >= output.length) {
          clearInterval(interval);
        }
      }, 15);
    }, 2200);
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="bg-white min-h-screen relative overflow-hidden group/main"
    >
      
      {/* Interactive Mouse Hover Spot Glow (Full Page) */}
      <div
        className="fixed pointer-events-none rounded-full transition-opacity duration-300 opacity-0 group-hover/main:opacity-100 z-50"
        style={{
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(26, 65, 219, 0.11) 0%, transparent 70%)",
          left: `${coords.x - 100}px`,
          top: `${coords.y - 100}px`,
          transform: "translate3d(0, 0, 0)",
          willChange: "left, top"
        }}
      />

      {/* ── HERO SECTION WITH GRID ACCENT ── */}
      <section
        id="demo"
        className="relative py-20 px-6 overflow-hidden border-b border-slate-100 bg-slate-50/30"
      >
        
        {/* SVG Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        {/* Soft Radial Brand Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-el-blue/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            {/* Top Pill Badge (no emoji) */}
            <div className="inline-flex items-center gap-2 bg-el-blue-light text-el-blue text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100/60 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Tool by Enlight Lab
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-el-heading leading-[1.1] mb-6 tracking-tight">
              Generate a Complete <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-el-blue to-blue-700">Product Requirements Doc</span>
            </h1>
            
            <p className="text-slate-500 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
              Answer few guided questions. Get a comprehensive, structured PRD - complete with user stories, acceptance criteria, edge cases, and non-functional requirements. Ready to hand to your engineering team.
            </p>
            
            <div className="flex items-center gap-3 mb-8 bg-white border border-slate-200/80 px-4 py-3.5 rounded-xl max-w-md shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-el-blue-light flex items-center justify-center text-el-blue font-bold text-xs">
                i
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Free preview. $10 for full PRD. No subscription.
              </p>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/sign-in"
                className="bg-el-blue text-white px-7 py-3.5 rounded-xl font-bold hover:bg-el-blue-dark transition-all duration-200 flex items-center gap-2 shadow-lg shadow-el-blue/15"
              >
                Try Demo
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="translate-y-[0.5px]">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              
              <a
                href="#how-it-works"
                className="border border-slate-250 text-slate-600 px-7 py-3.5 rounded-xl font-bold hover:border-el-blue hover:text-el-blue hover:bg-white transition-all duration-200"
              >
                See How It Works
              </a>
            </div>
            
            <p className="mt-8 text-xs font-semibold text-slate-400 flex items-center gap-2">
              <CheckIcon className="text-green-600 w-3.5 h-3.5" />
              Trusted by Product Managers, Founders & CTOs
            </p>
          </div>

          {/* ── INTERACTIVE HERO PREVIEW CARD ── */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col min-h-[460px] transition-all duration-300 hover:shadow-2xl">
            {/* Dark Header */}
            <div className="bg-slate-900 px-6 py-4.5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Example PRD Output</p>
                <p className="text-white font-bold text-sm sm:text-base">AI Expense Tracker for Freelancers</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Sections</p>
                <p className="text-white font-black text-xl sm:text-2xl">8/8</p>
              </div>
            </div>
            
            {/* Tabs List */}
            <div className="bg-slate-50 border-b border-slate-200/80 flex overflow-x-auto scrollbar-none">
              {[
                { id: "quality", label: "Quality Score" },
                { id: "stories", label: "User Stories" },
                { id: "edges", label: "Edge Cases" },
                { id: "tech", label: "Tech Stack" },
                { id: "roadmap", label: "Roadmap" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === t.id
                      ? "border-el-blue text-el-blue bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-white text-slate-805">
              <div className="transition-opacity duration-200">
                
                {activeTab === "quality" && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Automated Audit Scores</p>
                    {[
                      { label: "Completeness", value: 95, color: "bg-el-blue" },
                      { label: "Engineering Clarity", value: 88, color: "bg-el-blue" },
                      { label: "Edge Case Coverage", value: 76, color: "bg-blue-500" },
                      { label: "Acceptance Criteria Depth", value: 92, color: "bg-el-blue" },
                    ].map(item => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-650">{item.label}</span>
                          <span className="text-el-blue">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{width: `${item.value}%`}} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "stories" && (
                  <div className="space-y-3 font-mono text-[11px] sm:text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-150 max-h-[260px] overflow-y-auto">
                    <p className="font-bold text-el-blue">STORY-101: Unified Inbox View</p>
                    <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] mt-2">Description</p>
                    <p className="text-slate-600 pl-2 border-l border-slate-200">
                      AS A customer support agent,<br />
                      I WANT a single timeline view of email and chat logs,<br />
                      SO THAT I avoid asking redundant history questions.
                    </p>
                    <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] mt-2">Acceptance Criteria</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Consolidate Zendesk API hooks & webhooks.</li>
                      <li>Display chronological stream of events.</li>
                      <li>Render live lock screen if active edits overlap.</li>
                    </ul>
                  </div>
                )}

                {activeTab === "edges" && (
                  <div className="space-y-3 font-mono text-[11px] sm:text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-150 max-h-[260px] overflow-y-auto">
                    <p className="font-bold text-red-600">EC-001: Race Collision</p>
                    <p className="text-slate-600 pl-2 border-l border-red-200">
                      IF two agents submit replies to the same thread simultaneously,<br />
                      THEN block second submit and prompt with live concurrent conflict alert.
                    </p>
                    <p className="font-bold text-slate-800 mt-4">EC-002: Token Refresh Failure</p>
                    <p className="text-slate-600 pl-2 border-l border-slate-200">
                      IF JWT expiration occurs during active form dispatch,<br />
                      THEN route payload securely to session store prior to redirect.
                    </p>
                  </div>
                )}

                {activeTab === "tech" && (
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-150 max-h-[260px] overflow-y-auto">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Frontend</span>
                      <p className="font-bold text-slate-700 mt-0.5">Next.js 14</p>
                      <p className="text-slate-500 text-[10px]">Tailwind, Typescript</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Backend</span>
                      <p className="font-bold text-slate-700 mt-0.5">NestJS & BullMQ</p>
                      <p className="text-slate-500 text-[10px]">Job queues, Redis</p>
                    </div>
                    <div className="mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Databases</span>
                      <p className="font-bold text-slate-700 mt-0.5">PostgreSQL (Prisma)</p>
                      <p className="text-slate-500 text-[10px]">Pinecone Vectors</p>
                    </div>
                    <div className="mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">APIs & Integrations</span>
                      <p className="font-bold text-slate-700 mt-0.5">HubSpot CRM, Stripe</p>
                      <p className="text-slate-500 text-[10px]">Notion Sync API</p>
                    </div>
                  </div>
                )}

                {activeTab === "roadmap" && (
                  <div className="space-y-4 text-xs max-h-[260px] overflow-y-auto pl-1">
                    {[
                      { phase: "Phase 1: Foundation", weeks: "Weeks 1-4", desc: "Auth pipelines, database schemas, Notion OAuth integration endpoints." },
                      { phase: "Phase 2: Core Engine", weeks: "Weeks 5-12", desc: "Gemini intake parsing logic, prompt tuning, vector indexes." },
                      { phase: "Phase 3: GA Launch", weeks: "Weeks 13-24", desc: "Advanced reporting, automatic SLA alerts, security compliance validation." }
                    ].map((p, i) => (
                      <div key={i} className="relative pl-5 border-l border-slate-200 pb-2">
                        <span className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-el-blue border border-white" />
                        <div className="flex justify-between font-bold text-[11px] mb-0.5">
                          <span className="text-slate-800">{p.phase}</span>
                          <span className="text-el-blue font-mono">{p.weeks}</span>
                        </div>
                        <p className="text-slate-505 text-[11px] leading-snug">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                
              </div>

              {/* Card Footer list (no emoji) */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-450">
                <span className="font-semibold text-slate-500">Verified Layout Elements:</span>
                <div className="flex gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono">Glossary</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono">Metrics</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono">Out of Scope</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST LOGOS BANNER (NO EMOJIS) ── */}
      <section className="border-y border-slate-200/80 bg-slate-50/50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-extrabold text-el-blue uppercase tracking-widest mb-6">
            Trusted by Product Leads & Founders At
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-100 select-none">
            <span className="text-sm font-extrabold tracking-wider text-slate-605">NOTION WORKSPACE</span>
            <span className="text-sm font-extrabold tracking-wider text-slate-605">SLACK LABS</span>
            <span className="text-sm font-extrabold tracking-wider text-slate-605">FIGMA DESIGN</span>
            <span className="text-sm font-extrabold tracking-wider text-slate-605">STRIPE PAYMENTS</span>
            <span className="text-sm font-extrabold tracking-wider text-slate-605">INTERCOM SUPPORT</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold tracking-widest text-el-blue uppercase text-center mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-el-dark text-center mb-4 tracking-tight">
            From Vague Idea to Engineering-Ready PRD
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-16">
            Product managers use this tool to eliminate ambiguity before sprint planning, investor demos, and engineering kickoffs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                ),
                title: "Conversational Intake",
                desc: "Answer 7 guided questions. AI asks follow-ups if your answers are vague.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                ),
                title: "Instant Generation",
                desc: "Full PRD generated in under 30 seconds using Gemini 1.5 Pro.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                ),
                title: "Notion Export",
                desc: "Push your PRD directly to Notion via OAuth. One click.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3 3 3-3"/>
                  </svg>
                ),
                title: "PDF Export",
                desc: "Download a branded PDF to attach to proposals or share with stakeholders.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 transition-all duration-300 hover:border-el-blue/50 hover:shadow-lg hover:shadow-el-blue/5 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-el-blue-light rounded-xl flex items-center justify-center text-el-blue mb-5 group-hover:bg-el-blue group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SANDBOX WIDGET (NO EMOJIS) ── */}
      <section className="py-24 px-6 border-y border-slate-200/85 bg-slate-50/50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-xs font-extrabold tracking-widest text-el-blue uppercase text-center mb-3">Interactive Sandbox</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-el-dark text-center mb-4 tracking-tight">
            See the Intake Generator in Action
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-16">
            Select a project archetype or customize the product name below to simulate how our intake engine converts statements into requirements.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Sandbox controls */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
                    1. Choose an Archetype
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { name: "FlowDesk Support Inbox", desc: "For unified support threads." },
                      { name: "Uber for Dog Walking", desc: "For real-time pet coordinate tracking." },
                      { name: "AI Calendar Assistant", desc: "For conversational slot synchronization." }
                    ].map(t => (
                      <button
                        key={t.name}
                        onClick={() => {
                          setSandboxProduct(t.name);
                          setCustomProduct("");
                        }}
                        className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                          sandboxProduct === t.name && !customProduct
                            ? "bg-white border-el-blue text-el-blue shadow-sm"
                            : "bg-white border-slate-200 text-slate-650 hover:bg-slate-100/50"
                        }`}
                      >
                        <p className="font-bold">{t.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Or Enter Custom Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smart Lock Controller"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-el-blue focus:border-transparent text-sm font-medium bg-white"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={runSandbox}
                  disabled={sandboxLoading}
                  className="w-full bg-el-blue text-white px-6 py-3.5 rounded-xl font-bold hover:bg-el-blue-dark transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-md shadow-el-blue/10"
                >
                  {sandboxLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      Analyze & Generate Draft
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Output Monitor */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 text-left font-mono text-[11px] sm:text-xs text-slate-350 min-h-[350px] flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Console Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/80" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Gemini-1.5-Pro Shell
                    </span>
                  </div>

                  {/* Logs list */}
                  <div className="space-y-1 mb-4 text-slate-400">
                    {sandboxConsole.map((log, idx) => (
                      <p key={idx} className={log.includes("[SUCCESS]") ? "text-green-400" : log.includes("[INFO]") ? "text-slate-500" : ""}>
                        {log}
                      </p>
                    ))}
                    {sandboxStage === "parsing" && (
                      <p className="text-el-blue animate-pulse">Running semantic parsing pipeline...</p>
                    )}
                  </div>

                  {/* Typing content */}
                  {sandboxContent && (
                    <div className="border-t border-slate-800/80 pt-4 text-slate-350 overflow-y-auto max-h-[220px]">
                      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300">
                        {sandboxContent}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-650 border-t border-slate-800/50 pt-3 flex justify-between">
                  <span>Target: {customProduct.trim() || sandboxProduct}</span>
                  <span>Status: {sandboxStage.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS timeline stepper (NO EMOJIS) ── */}
      <section className="py-24 px-6 bg-slate-50/20" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold tracking-widest text-el-blue uppercase text-center mb-3">Process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-el-dark text-center mb-16 tracking-tight">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                n: "01",
                title: "Answer few Questions",
                desc: "Identify your product target, core issues, user segment, features, limits, metrics, and out-of-scope tasks. Takes about 5 minutes.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="4" rx="1"/><path d="M4 6h16v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6z"/><path d="M8 11h8M8 15h5"/>
                  </svg>
                ),
              },
              {
                n: "02",
                title: "AI Drafts Specifications",
                desc: "Gemini 1.5 Pro structures your inputs into a comprehensive PRD - detailing critical security requirements, database choices, and edge cases.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a5 5 0 015 5c0 1.8-.9 3.3-2.3 4.2L16 21H8l1.3-9.8A5 5 0 017 7a5 5 0 015-5z"/><path d="M9 21h6"/>
                  </svg>
                ),
              },
              {
                n: "03",
                title: "Export & Direct Sync",
                desc: "Download clean layouts as custom PDFs or sync straight to Notion in one click. Easily share links with your engineering leads.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><circle cx="11" cy="15" r="2"/><path d="M13 15h3"/>
                  </svg>
                ),
              },
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200/80 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-el-blue flex items-center justify-center text-white font-extrabold text-sm">
                      {s.n}
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-el-blue-light flex items-center justify-center text-el-blue">
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-lg mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION (NO EMOJIS) ── */}
      <section className="relative bg-el-navy text-white py-24 px-6 overflow-hidden">
        {/* Decorative Grid Overlay inside CTA */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-el-blue/10 blur-[130px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 tracking-tight">
            Your PRD is few Questions Away
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Stop staring at a blank Notion page. Let AI write the first draft - your team ships faster.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/sign-in"
              className="bg-white text-el-blue px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-white/5"
            >
              Start Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <a
              href="https://enlightlab.com/contact"
              className="border border-white/20 text-white/90 px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 hover:border-white transition-all duration-200"
            >
              Talk to an Expert
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION (NO EMOJIS, SVG STARS) ── */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold tracking-widest text-el-blue uppercase text-center mb-3">Trusted</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-el-dark text-center mb-16 tracking-tight">
            Trusted by Product Teams
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "I used to spend two days writing PRDs. This got me from idea to shareable doc in 8 minutes.", name: "James R.", role: "Founder, SaaS Startup" },
              { q: "Our engineering team stopped asking clarifying questions mid-sprint. The PRDs are that detailed.", name: "Maria S.", role: "Head of Product, B2B" },
              { q: "The edge cases section alone saved a full sprint. Genuinely impressive AI output.", name: "Aditya K.", role: "Solo Founder" },
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-50/50 rounded-2xl p-8 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">"{t.q}"</p>
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION (NO EMOJIS) ── */}
      <section id="faq" className="py-24 px-6 bg-slate-50/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-el-dark text-center mb-16 tracking-tight">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              { q: "What is a PRD?", a: "A Product Requirements Document defines what you're building, why, for whom, and how success is measured. It's the blueprint your engineering team works from." },
              { q: "How long does it take?", a: "About 5 minutes to answer the intake questions. The PRD is generated in under 30 seconds after that." },
              { q: "Is my data stored?", a: "Yes, your intake answers and generated PRD are stored so you can access them later. We do not share your data with third parties." },
              { q: "What does the free version include?", a: "The executive summary and first 3 user stories. Upgrade for $10 to unlock the full PRD, edge cases, PDF export, and Notion sync." },
              { q: "Can I regenerate my PRD?", a: "Yes. You can edit your answers and regenerate as many times as you need within the same session." },
            ].map((f, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-850 hover:text-el-blue transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base">{f.q}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transform transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180 text-el-blue" : "text-slate-400"
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaq === idx ? "max-h-40 border-t border-slate-100" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50/50">
                    {f.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://cal.com/dhananjay-goel/30min"
              className="bg-el-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-el-blue-dark transition-all duration-200 inline-flex items-center gap-2.5 shadow-md shadow-el-blue/10"
            >
              Book a Discovery Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}