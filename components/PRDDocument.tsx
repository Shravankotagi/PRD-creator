"use client";

import React from "react";
import { GatedPRD, LockedSection } from "@/lib/gating";
import { UserPlan } from "@/lib/gating";
import {
  EdgeCase,
  FunctionalRequirement,
  NonFunctionalRequirement,
  UserStory,
  SuccessMetric,
  TechStack,
  TimelineMilestone,
  GlossaryTerm,
  Stakeholder,
  VersionRevision,
} from "@/types/prd";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PRDDocumentProps {
  productName: string;
  prd: GatedPRD;
  plan: UserPlan;
  onUpgrade?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priorityColor(priority: string) {
  switch (priority) {
    case "HIGH":
      return "bg-red-50 text-red-600 border-red-200";
    case "MEDIUM":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "LOW":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function impactColor(impact: string) {
  return priorityColor(impact);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-el-blue-light border border-blue-100 flex items-center justify-center text-el-blue flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-base font-bold text-el-navy tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-el-border rounded-2xl p-6 mb-5 shadow-el-card">
      {children}
    </div>
  );
}

function LockedSectionCard({
  title,
  icon,
  onUpgrade,
}: {
  title: string;
  icon: React.ReactNode;
  onUpgrade?: () => void;
}) {
  return (
    <div className="relative bg-white border border-el-border rounded-2xl p-6 mb-5 overflow-hidden shadow-el-card">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[3px] bg-white/80 rounded-2xl z-10 flex flex-col items-center justify-center gap-4 px-4 py-8">
        <div className="w-10 h-10 rounded-full bg-el-blue-light border border-blue-200 flex items-center justify-center text-el-blue shadow-sm">
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-el-navy">
            {title} is locked
          </p>
          <p className="text-xs text-el-body mt-1 max-w-[280px]">
            Upgrade to the PRO plan to access this section, edge cases, Notion sync, and PDF download.
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="text-xs font-bold text-white bg-el-blue hover:bg-el-blue-dark px-5 py-2.5 rounded-lg transition-all duration-150 shadow-el-blue hover:shadow-none"
        >
          Upgrade to unlock →
        </button>
      </div>

      {/* Fake blurred content */}
      <div className="opacity-15 select-none pointer-events-none">
        <SectionHeading title={title} icon={icon} />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-3.5 bg-slate-300 rounded-full"
              style={{ width: `${60 + i * 15}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded border ${className}`}
    >
      {label}
    </span>
  );
}

function UserStoryCard({ story }: { story: UserStory }) {
  return (
    <div className="border-l-4 border-el-blue border-y border-r border-el-border bg-el-blue-light/10 rounded-r-xl p-5 mb-4 last:mb-0 hover:bg-el-blue-light/15 transition-colors duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold tracking-widest text-el-blue uppercase">
          {story.id}
        </span>
        <span className="text-sm font-bold text-el-navy">{story.title}</span>
      </div>
      <p className="text-sm text-el-body leading-relaxed mb-4">
        {story.story}
      </p>
      {story.acceptanceCriteria.length > 0 && (
        <div className="bg-white/70 border border-el-border rounded-lg p-4 mt-3">
          <p className="text-[10px] font-bold tracking-wider text-el-navy uppercase mb-2.5">
            Acceptance Criteria
          </p>
          <ul className="space-y-2">
            {story.acceptanceCriteria.map((criterion, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-el-body">
                <svg
                  className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8.5L6.5 12L13 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="leading-relaxed">{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FunctionalReqRow({ req }: { req: FunctionalRequirement }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-el-border last:border-0">
      <div className="flex items-center gap-2 sm:w-16 flex-shrink-0">
        <span className="text-[10px] font-bold text-el-muted uppercase">
          {req.id}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-el-navy mb-1">{req.title}</p>
        <p className="text-xs text-el-body leading-relaxed">
          {req.description}
        </p>
      </div>
      <div className="mt-1 sm:mt-0 flex-shrink-0">
        <Badge label={req.priority} className={priorityColor(req.priority)} />
      </div>
    </div>
  );
}

function NonFunctionalReqRow({ req }: { req: NonFunctionalRequirement }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-el-border last:border-0">
      <div className="flex-shrink-0 sm:w-32 mb-1.5 sm:mb-0">
        <Badge
          label={req.category}
          className="bg-el-blue-light text-el-blue border-blue-200 w-full text-center flex-shrink-0"
        />
      </div>
      <p className="text-xs text-el-body leading-relaxed flex-1">
        {req.description}
      </p>
    </div>
  );
}

function EdgeCaseCard({ ec }: { ec: EdgeCase }) {
  return (
    <div className="border border-el-border rounded-xl p-5 mb-4 last:mb-0 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
        <span className="text-[10px] font-bold tracking-widest text-el-muted">
          {ec.id}
        </span>
        <span className="text-xs font-bold text-el-navy">
          {ec.category}
        </span>
        <Badge label={ec.impact} className={impactColor(ec.impact)} />
      </div>
      <p className="text-sm text-el-body leading-relaxed mb-3">
        {ec.scenario}
      </p>
      <div className="flex items-start gap-2.5 bg-el-blue-light/30 border border-blue-100 rounded-lg p-3">
        <span className="text-el-blue text-xs mt-0.5 flex-shrink-0">→</span>
        <p className="text-xs text-el-navy leading-relaxed font-medium">{ec.suggestion}</p>
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-el-body">
          <span className="text-el-blue mt-1 flex-shrink-0 text-xs">●</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = {
  summary: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  stories: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  functional: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M3 4l5 4-5 4M9 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  nfr: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  scope: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  assumptions: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  questions: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M6 6a2 2 0 114 0c0 1-1 1.5-2 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  edge: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M8 2l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 11 4.3 13.5l1.4-4.3L2 6.5h4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  techStack: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M6 10l-4-4 4-4M10 2l4 4-4 4M7.5 13.5l1-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  timeline: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 1v2M11 1v2M2 7h12M5 10h1M10 10h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  glossary: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M3 2v12h10V2H3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  stakeholders: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 13.5c0-2 2-3.5 5-3.5s5 1.5 5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  versionHistory: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  successMetrics: (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <path d="M2 13h12M4 10l3-4 3 2 3-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function PRDDocument({
  productName,
  prd,
  plan,
  onUpgrade,
}: PRDDocumentProps) {
  const isLocked = (section: LockedSection) =>
    prd.lockedSections.includes(section);

  return (
    <div className="w-full">
      {/* Executive Summary */}
      <SectionCard>
        <SectionHeading title="Executive Summary" icon={Icon.summary} />
        <p className="text-sm text-el-body leading-relaxed whitespace-pre-wrap">
          {prd.executiveSummary}
        </p>
      </SectionCard>

      {/* User Stories */}
      <SectionCard>
        <SectionHeading title="User Stories" icon={Icon.stories} />
        <div className="space-y-4">
          {prd.userStories.map((story) => (
            <UserStoryCard key={story.id} story={story} />
          ))}
        </div>
      </SectionCard>

      {/* Functional Requirements */}
      <SectionCard>
        <SectionHeading title="Functional Requirements" icon={Icon.functional} />
        <div className="divide-y divide-el-border">
          {prd.functionalRequirements && prd.functionalRequirements.length > 0 ? (
            prd.functionalRequirements.map((req) => (
              <FunctionalReqRow key={req.id} req={req} />
            ))
          ) : (
            <p className="text-xs text-el-muted py-2">No requirements defined.</p>
          )}
        </div>
      </SectionCard>

      {/* Success Metrics */}
      {isLocked("successMetrics") ? (
        <LockedSectionCard
          title="Success Metrics & KPIs"
          icon={Icon.successMetrics}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.successMetrics && prd.successMetrics.length > 0 && (
          <SectionCard>
            <SectionHeading title="Success Metrics & KPIs" icon={Icon.successMetrics} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prd.successMetrics.map((m: SuccessMetric, i: number) => (
                <div key={i} className="border border-el-border bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between hover:border-el-blue/30 transition-all duration-150 shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-el-blue uppercase tracking-wider block mb-1">KPI {i + 1}</span>
                    <h4 className="text-sm font-bold text-el-navy mb-1.5">{m.metric}</h4>
                    <p className="text-xs text-el-body font-semibold mb-2 bg-white border border-el-border inline-block px-2.5 py-1 rounded-md shadow-sm">
                      Target: <span className="text-el-blue font-bold">{m.target}</span>
                    </p>
                  </div>
                  <div className="border-t border-el-border/60 pt-2.5 mt-2.5">
                    <span className="text-[9px] font-bold text-el-muted uppercase block mb-1">Measurement Math / Source</span>
                    <p className="text-xs text-el-body italic leading-relaxed">{m.measurement}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )
      )}

      {/* Tech Stack */}
      {isLocked("techStack") ? (
        <LockedSectionCard
          title="Technology Stack & Architecture"
          icon={Icon.techStack}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.techStack && (
          <SectionCard>
            <SectionHeading title="Technology Stack & Architecture" icon={Icon.techStack} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-el-border bg-slate-50/40 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-el-blue uppercase tracking-wider block mb-1.5">Frontend Stack</span>
                <p className="text-xs text-el-navy font-semibold leading-relaxed">{prd.techStack.frontend}</p>
              </div>
              <div className="border border-el-border bg-slate-50/40 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-el-blue uppercase tracking-wider block mb-1.5">Backend Stack</span>
                <p className="text-xs text-el-navy font-semibold leading-relaxed">{prd.techStack.backend}</p>
              </div>
              <div className="border border-el-border bg-slate-50/40 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-el-blue uppercase tracking-wider block mb-1.5">Database & Caching</span>
                <p className="text-xs text-el-navy font-semibold leading-relaxed">{prd.techStack.database}</p>
              </div>
              <div className="border border-el-border bg-slate-50/40 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-el-blue uppercase tracking-wider block mb-1.5">Key Integrations</span>
                <ul className="space-y-1 mt-1">
                  {prd.techStack.integrations?.map((item: string, index: number) => (
                    <li key={index} className="text-xs text-el-body flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-el-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {prd.techStack.architecture && (
              <div className="bg-el-blue-light/20 border border-el-blue/20 rounded-xl p-4 shadow-inner">
                <span className="text-[10px] font-bold text-el-blue uppercase tracking-wider block mb-1.5">Architectural Patterns & Security</span>
                <p className="text-xs text-el-navy leading-relaxed font-medium">{prd.techStack.architecture}</p>
              </div>
            )}
          </SectionCard>
        )
      )}

      {/* Timeline / Roadmap */}
      {isLocked("timeline") ? (
        <LockedSectionCard
          title="Product Roadmap & Milestones"
          icon={Icon.timeline}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.timeline && prd.timeline.length > 0 && (
          <SectionCard>
            <SectionHeading title="Product Roadmap & Milestones" icon={Icon.timeline} />
            <div className="space-y-4">
              {prd.timeline.map((m: TimelineMilestone, i: number) => (
                <div key={i} className="border border-el-border rounded-xl p-5 relative overflow-hidden bg-white shadow-sm flex flex-col md:flex-row gap-4 items-start hover:border-el-blue/20 transition-all">
                  <div className="md:w-1/4 flex-shrink-0">
                    <span className="text-[10px] font-bold text-el-blue bg-el-blue-light border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1.5">
                      {m.duration}
                    </span>
                    <h4 className="text-sm font-extrabold text-el-navy">{m.phase}</h4>
                  </div>
                  <div className="md:w-3/4 w-full">
                    <span className="text-[9px] font-bold text-el-muted uppercase tracking-wider block mb-2">Key Deliverables</span>
                    <ul className="space-y-1.5">
                      {m.deliverables?.map((del: string, dIdx: number) => (
                        <li key={dIdx} className="text-xs text-el-body flex items-start gap-2 leading-relaxed">
                          <svg className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )
      )}

      {/* Non-Functional Requirements */}
      {isLocked("nonFunctionalRequirements") ? (
        <LockedSectionCard
          title="Non-Functional Requirements"
          icon={Icon.nfr}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.nonFunctionalRequirements && prd.nonFunctionalRequirements.length > 0 && (
          <SectionCard>
            <SectionHeading
              title="Non-Functional Requirements"
              icon={Icon.nfr}
            />
            <div className="divide-y divide-el-border">
              {prd.nonFunctionalRequirements.map((req) => (
                <NonFunctionalReqRow key={req.id} req={req} />
              ))}
            </div>
          </SectionCard>
        )
      )}

      {/* Out of Scope */}
      {isLocked("outOfScope") ? (
        <LockedSectionCard
          title="Out of Scope"
          icon={Icon.scope}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.outOfScope && prd.outOfScope.length > 0 && (
          <SectionCard>
            <SectionHeading title="Out of Scope" icon={Icon.scope} />
            <BulletList items={prd.outOfScope} />
          </SectionCard>
        )
      )}

      {/* Assumptions */}
      {isLocked("assumptions") ? (
        <LockedSectionCard
          title="Assumptions"
          icon={Icon.assumptions}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.assumptions && prd.assumptions.length > 0 && (
          <SectionCard>
            <SectionHeading title="Assumptions" icon={Icon.assumptions} />
            <BulletList items={prd.assumptions} />
          </SectionCard>
        )
      )}

      {/* Open Questions */}
      {isLocked("openQuestions") ? (
        <LockedSectionCard
          title="Open Questions"
          icon={Icon.questions}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.openQuestions && prd.openQuestions.length > 0 && (
          <SectionCard>
            <SectionHeading title="Open Questions" icon={Icon.questions} />
            <BulletList items={prd.openQuestions} />
          </SectionCard>
        )
      )}

      {/* Edge Cases */}
      {isLocked("edgeCases") ? (
        <LockedSectionCard
          title="Edge Cases"
          icon={Icon.edge}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.edgeCases && prd.edgeCases.length > 0 && (
          <SectionCard>
            <SectionHeading title="Edge Cases" icon={Icon.edge} />
            <div className="space-y-4">
              {prd.edgeCases.map((ec) => (
                <EdgeCaseCard key={ec.id} ec={ec} />
              ))}
            </div>
          </SectionCard>
        )
      )}

      {/* Glossary */}
      {isLocked("glossary") ? (
        <LockedSectionCard
          title="Domain Glossary"
          icon={Icon.glossary}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.glossary && prd.glossary.length > 0 && (
          <SectionCard>
            <SectionHeading title="Domain Glossary" icon={Icon.glossary} />
            <div className="border border-el-border rounded-xl overflow-hidden shadow-sm divide-y divide-el-border">
              {prd.glossary.map((item: GlossaryTerm, index: number) => (
                <div key={index} className="p-4 bg-slate-50/20 hover:bg-slate-50/40 transition-colors flex flex-col sm:flex-row sm:items-start gap-2">
                  <span className="sm:w-1/4 font-bold text-sm text-el-navy">{item.term}</span>
                  <span className="sm:w-3/4 text-xs text-el-body leading-relaxed">{item.definition}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )
      )}

      {/* Stakeholders */}
      {isLocked("stakeholders") ? (
        <LockedSectionCard
          title="Project Stakeholders"
          icon={Icon.stakeholders}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.stakeholders && prd.stakeholders.length > 0 && (
          <SectionCard>
            <SectionHeading title="Project Stakeholders" icon={Icon.stakeholders} />
            <div className="border border-el-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-el-border text-[10px] font-bold text-el-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Sign-Off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-el-border text-xs text-el-body">
                  {prd.stakeholders.map((st: Stakeholder, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-el-navy">{st.role}</td>
                      <td className="py-3 px-4">{st.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          st.approval === "Required" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}>
                          {st.approval}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )
      )}

      {/* Version History */}
      {isLocked("versionHistory") ? (
        <LockedSectionCard
          title="Revision & Version History"
          icon={Icon.versionHistory}
          onUpgrade={onUpgrade}
        />
      ) : (
        prd.versionHistory && prd.versionHistory.length > 0 && (
          <SectionCard>
            <SectionHeading title="Revision & Version History" icon={Icon.versionHistory} />
            <div className="border border-el-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-el-border text-[10px] font-bold text-el-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-el-border text-xs text-el-body">
                  {prd.versionHistory.map((v: VersionRevision, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-el-blue">{v.version}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{v.date}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{v.author}</td>
                      <td className="py-3 px-4 leading-relaxed">{v.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )
      )}
    </div>
  );
}