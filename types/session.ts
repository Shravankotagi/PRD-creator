import { PRD } from "./prd";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface IntakeAnswers {
  productName: string;
  problemStatement: string;
  targetAudience: string;
  goals: string[];
  existingSolutions?: string;
  constraints?: string;
  successMetrics?: string;
  additionalContext?: string;
}

export interface Intake {
  answers: IntakeAnswers;
  completedAt: string;
}

export type SessionStatus = "intake" | "generating" | "review" | "done";

export interface Session {
  id: string;
  user: User;
  intake?: Intake;
  prd?: PRD;
  status: SessionStatus;
  notionPageUrl?: string;
  createdAt: string;
  updatedAt: string;
}