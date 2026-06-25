export const INTAKE_QUESTIONS = [
  {
    id: "productName",
    step: 1,
    field: "productName",
    question: "Let's start with the basics — what is the name of your product?",
    placeholder: "e.g. TaskFlow, BudgetAI, ShipFast...",
    helpText: "Just the product name is fine.",
  },
  {
    id: "problemStatement",
    step: 2,
    field: "problemStatement",
    question:
      "What problem does this product solve? Be as specific as possible.",
    placeholder:
      "e.g. Small business owners spend 3+ hours a week manually tracking invoices with no visibility into cash flow...",
    helpText:
      "The more specific you are here, the better your PRD will be. Mention who has the problem and how painful it is.",
  },
  {
    id: "targetUser",
    step: 3,
    field: "targetUser",
    question:
      "Who is the primary target user? Describe them in detail.",
    placeholder:
      "e.g. Freelance designers aged 25-40 who work with 3-10 clients at a time and currently use spreadsheets to track payments...",
    helpText:
      "Include their role, context, and current behavior if possible.",
  },
  {
    id: "coreUseCases",
    step: 4,
    field: "coreUseCases",
    question:
      "What are the 3-5 core things a user will do with this product?",
    placeholder:
      "e.g. 1. Create and send invoices, 2. Track payment status, 3. Set automated payment reminders, 4. View revenue dashboard...",
    helpText:
      "Think of these as the main actions or workflows your product enables.",
  },
  {
    id: "knownConstraints",
    step: 5,
    field: "knownConstraints",
    question:
      "Are there any known technical, business, or time constraints we should be aware of?",
    placeholder:
      "e.g. Must integrate with Stripe, needs to launch in 8 weeks, budget is under $20k, must work on mobile...",
    helpText:
      "Include tech stack requirements, deadlines, integrations, or budget limits.",
  },
  {
    id: "successMetrics",
    step: 6,
    field: "successMetrics",
    question:
      "How will you measure success? What does a good outcome look like?",
    placeholder:
      "e.g. 500 active users in 3 months, invoice creation under 2 minutes, payment collection rate above 85%...",
    helpText:
      "Think in terms of numbers, user behaviors, or business outcomes.",
  },
  {
    id: "nonGoals",
    step: 7,
    field: "nonGoals",
    question:
      "What is this product explicitly NOT trying to do in version 1?",
    placeholder:
      "e.g. Not a full accounting platform, no multi-currency support, no team collaboration features in v1...",
    helpText:
      "Non-goals are just as important as goals — they prevent scope creep.",
  },
];

export const TOTAL_STEPS = INTAKE_QUESTIONS.length;

export type IntakeField =
  | "productName"
  | "problemStatement"
  | "targetUser"
  | "coreUseCases"
  | "knownConstraints"
  | "successMetrics"
  | "nonGoals";

export type IntakeAnswers = Record<IntakeField, string>;

export const EMPTY_INTAKE: IntakeAnswers = {
  productName: "",
  problemStatement: "",
  targetUser: "",
  coreUseCases: "",
  knownConstraints: "",
  successMetrics: "",
  nonGoals: "",
};