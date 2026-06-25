import { prisma } from "@/lib/prisma";
import { PRD } from "@/types/prd";

export type UserPlan = "FREE" | "PAID";

export interface GatedPRD {
  executiveSummary: PRD["executiveSummary"];
  userStories: PRD["userStories"];
  functionalRequirements: PRD["functionalRequirements"];
  nonFunctionalRequirements?: PRD["nonFunctionalRequirements"];
  outOfScope?: PRD["outOfScope"];
  assumptions?: PRD["assumptions"];
  openQuestions?: PRD["openQuestions"];
  edgeCases?: PRD["edgeCases"];
  techStack?: PRD["techStack"];
  timeline?: PRD["timeline"];
  glossary?: PRD["glossary"];
  versionHistory?: PRD["versionHistory"];
  stakeholders?: PRD["stakeholders"];
  successMetrics?: PRD["successMetrics"];
  lockedSections: LockedSection[];
}

export type LockedSection =
  | "nonFunctionalRequirements"
  | "outOfScope"
  | "assumptions"
  | "openQuestions"
  | "edgeCases"
  | "techStack"
  | "timeline"
  | "glossary"
  | "versionHistory"
  | "stakeholders"
  | "successMetrics";

export const PAID_ONLY_SECTIONS: LockedSection[] = [
  "nonFunctionalRequirements",
  "outOfScope",
  "assumptions",
  "openQuestions",
  "edgeCases",
  "techStack",
  "timeline",
  "glossary",
  "versionHistory",
  "stakeholders",
  "successMetrics",
];

export async function getUserPlan(
  userId: string,
  sessionId?: string,
  preloadedUser?: { plan: any },
  preloadedSession?: { plan: any }
): Promise<UserPlan> {
  const userPlan = preloadedUser ? preloadedUser.plan : (await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  }))?.plan;

  if (!userPlan) return "FREE";
  if (userPlan === "PAID") return "PAID";

  if (sessionId) {
    const sessionPlan = preloadedSession ? preloadedSession.plan : (await prisma.session.findUnique({
      where: { id: sessionId },
      select: { plan: true },
    }))?.plan;
    if (sessionPlan === "PAID") {
      return "PAID";
    }
  }

  return "FREE";
}

export function isPaidUser(plan: UserPlan): boolean {
  return plan === "PAID";
}

export function isFreeUser(plan: UserPlan): boolean {
  return plan === "FREE";
}

export function gatePRD(prd: PRD, plan: UserPlan): GatedPRD {
  if (isPaidUser(plan)) {
    return {
      ...prd,
      lockedSections: [],
    };
  }

  return {
    executiveSummary: prd.executiveSummary,
    userStories: prd.userStories ? prd.userStories.slice(0, 3) : [],
    functionalRequirements: prd.functionalRequirements ?? [],
    lockedSections: PAID_ONLY_SECTIONS,
  };
}

export function getAllowedSections(plan: UserPlan): string[] {
  const base = [
    "executiveSummary",
    "userStories",
    "functionalRequirements",
  ];

  if (isPaidUser(plan)) {
    return [...base, ...PAID_ONLY_SECTIONS];
  }

  return base;
}

export function isSectionLocked(
  section: LockedSection,
  plan: UserPlan
): boolean {
  return isFreeUser(plan) && PAID_ONLY_SECTIONS.includes(section);
}