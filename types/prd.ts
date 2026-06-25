export interface UserStory {
  id: string;
  title: string;
  story: string;
  acceptanceCriteria: string[];
}

export type RequirementPriority = "HIGH" | "MEDIUM" | "LOW";

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: RequirementPriority;
}

export type NonFunctionalCategory =
  | "PERFORMANCE"
  | "SECURITY"
  | "SCALABILITY"
  | "RELIABILITY"
  | "USABILITY"
  | "MAINTAINABILITY"
  | "COMPATIBILITY"
  | "ACCESSIBILITY";

export interface NonFunctionalRequirement {
  id: string;
  category: NonFunctionalCategory;
  description: string;
}

export type EdgeCaseImpact = "HIGH" | "MEDIUM" | "LOW";

export interface EdgeCase {
  id: string;
  category: string;
  scenario: string;
  impact: EdgeCaseImpact;
  suggestion: string;
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  integrations: string[];
  architecture: string;
}

export interface TimelineMilestone {
  phase: string;
  duration: string;
  deliverables: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface VersionRevision {
  version: string;
  date: string;
  author: string;
  description: string;
}

export interface Stakeholder {
  role: string;
  name: string;
  approval: string;
}

export interface SuccessMetric {
  metric: string;
  target: string;
  measurement: string;
}

export interface PRD {
  executiveSummary: string;
  userStories: UserStory[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  outOfScope: string[];
  assumptions: string[];
  openQuestions: string[];
  edgeCases: EdgeCase[];
  techStack?: TechStack | null;
  timeline?: TimelineMilestone[] | null;
  glossary?: GlossaryTerm[] | null;
  versionHistory?: VersionRevision[] | null;
  stakeholders?: Stakeholder[] | null;
  successMetrics?: SuccessMetric[] | null;
}