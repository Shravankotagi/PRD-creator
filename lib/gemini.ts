import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
});

async function generateWithRetry(prompt: string, maxRetries = 3, initialDelay = 1000): Promise<any> {
  let delay = initialDelay;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await geminiModel.generateContent(prompt);
      return result;
    } catch (err: any) {
      const isRateLimitOrUnavailable =
        err?.status === 429 ||
        err?.status === 503 ||
        err?.message?.toLowerCase().includes("high demand") ||
        err?.message?.toLowerCase().includes("spikes in demand") ||
        err?.message?.toLowerCase().includes("unavailable");

      if (isRateLimitOrUnavailable && attempt < maxRetries) {
        console.warn(`Gemini API returned error (attempt ${attempt}/${maxRetries}): ${err?.message || err}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw new Error("Failed after maximum retries");
}

export async function generatePRD(intake: {
  productName: string;
  problemStatement: string;
  targetUser: string;
  coreUseCases: string;
  knownConstraints: string;
  successMetrics: string;
  nonGoals: string;
}): Promise<string> {
  const prompt = `
You are a world-class principal product manager and software architect at a top-tier tech company. Generate an exceptionally precise, comprehensive, and engineering-ready Product Requirements Document (PRD) for the product "${intake.productName}". 

CRITICAL REQUIREMENTS:
1. Every user story, requirement, metric, architectural choice, and milestone must be SPECIFIC to "${intake.productName}" and the exact user personas/workflows.
2. DO NOT use generic placeholder text (e.g., "The system must validate input" or "User can login"). Provide concrete technical details: actual database field names, validation rules, exact integration protocols, rate limits, schema details, or error-handling flows.
3. If this is a B2B support/ticketing tool (like FlowDesk), describe actual integrations (e.g., Zendesk Ticket API, Intercom Webhook payloads, HubSpot CRM Card APIs), message queue architectures (e.g., BullMQ, RabbitMQ, Kafka) for ingestion, rate limits (e.g., max 100 requests/min per webhook source), and token storage security (e.g., AES-256-GCM encryption for client API keys).
4. Functional requirements must be detailed enough that a developer could start writing the database schemas, API endpoints, or UI layouts immediately.
5. All success metrics must include real baseline numbers, target thresholds, and exact math/measurement formulas.
6. CONSISTENT GHERKIN FORMAT WITH FAILURE PATHS: For ALL user stories, the acceptance criteria must consistently use Gherkin format (e.g., 'Given [precondition], when [action], then [expected result]'). Each story MUST contain a minimum of 2-3 acceptance criteria. At least one criterion per story must define a failure path, timeout, empty state, or rate limit edge case (e.g. what happens when external API lookups fail or return no results, or when an API connection times out).
7. BUSINESS & GTM NON-GOALS: In the "outOfScope" array, you must explicitly separate and list both:
   - "Technical Non-Goals" (e.g., '[Technical] No native mobile app in Phase 1')
   - "Business / GTM Non-Goals" (e.g., '[Business] Not targeting Fortune 500 / enterprise contracts in v1')
   Ensure that any business/GTM constraints specified in the intake (like targeting mid-size SaaS and not targeting enterprise contracts) are strictly captured.
8. STAKEHOLDER & AUTHOR NAMES: Do not write fake-professional dummy names (e.g., 'Lead Product Manager' as a person's name) in the stakeholders table or revision history. Instead, set name fields to "[TBD - Owner Name]" or "[TBD - Author Name]" to allow team members to sign off.
9. MINIMUM 6-8 OPEN QUESTIONS: Surface a minimum of 6-8 highly specific, deep open questions. Specifically cover billing models (flat vs seat-based), data residency (EU/US clusters), HubSpot read/write scopes, and degraded state behaviors when third-party APIs are simultaneously rate-limited.
10. ROADMAP REALISM & LINKING: The roadmap timeline must be realistic for a 4-engineer team building a multi-integration product. DO NOT compress everything to a 12-week build; model a realistic 20-24 weeks timeline (e.g. Weeks 1-8 for Phase 1, Weeks 9-16 for Phase 2, Weeks 17-24 for Phase 3). Each phase must list at least 4 detailed deliverables, define clear acceptance/done gates, denote which stakeholder role owns/drives the phase, and strictly map to Functional Requirement IDs (e.g., 'Core Ingestion Worker [FR-001]').
11. CROSS-REFERENCE VALIDATION: Perform a strict cross-reference match: any FR ID tag referenced in the roadmap timeline must correspond exactly to the functional requirement defined under that ID (e.g., if a timeline deliverable is tagged with [FR-005], then [FR-005] must match the name and description of the requirement in the functionalRequirements list).
12. PRIORITY ALIGNMENT: Ensure that features listed as core to the Tech Stack (like integrations or queue workers) are not marked as LOW priority. Align priorities logically (e.g., if HubSpot card is a core integration, it must be MEDIUM or HIGH priority).
13. INFRASTRUCTURE & ORDERING: List functional requirements in logical build order (e.g., DB schema and Ingest workers first, Dashboard and third-party CRM card integrations last). Detail architectural decisions explicitly in the architecture summary (e.g., if Redis is used for both queues and caching, specify whether separate Redis clusters or a shared cluster with logical database split is utilized. If cold storage/archiving is referenced in user stories, there must be a corresponding functional requirement, e.g. '[FR-007] S3 Glacier Cold Storage integration').
14. GLOSSARY MERGING: Generate a comprehensive Glossary with at least 5-6 key domain terms (specifically including 'CSAT', 'SLA', 'Context Switching Tax', 'Unified Event Store', and 'RBAC').
15. COMPLIANCE NFR: Under Non-Functional Requirements, explicitly include a security compliance requirement for SOC 2 Type II audit logging (e.g., immutable logging of all auth events, admin changes, and API key rotations).
16. TECHNICAL METRIC CONSISTENCY: Ensure success metrics measurements are technically consistent with the tech stack. If a metric references user authentication (e.g., unique agent logins), reference database session tables or JWT tokens, NOT third-party identity tools like Auth0 unless Auth0 is explicitly defined as the Identity Provider in the tech stack.

INTAKE INFORMATION:
- Product Name: ${intake.productName}
- Problem Statement: ${intake.problemStatement}
- Target User: ${intake.targetUser}
- Core Use Cases: ${intake.coreUseCases}
- Known Constraints: ${intake.knownConstraints}
- Success Metrics (User Input): ${intake.successMetrics}
- Non-Goals: ${intake.nonGoals}

Generate the PRD in the following EXACT JSON format and nothing else. Ensure the response is valid, well-formed JSON:

{
  "executiveSummary": "A highly detailed, 3-paragraph executive summary. Paragraph 1: The product description, the specific pain point it solves, and the target market. Paragraph 2: Core workflow details, features, and how it acts as a unified source of truth. Paragraph 3: Strategic business goals, success metrics, and expected outcomes.",
  "userStories": [
    {
      "id": "US-001",
      "title": "DESCRIPTIVE STORY TITLE IN ALL CAPS",
      "story": "As a [specific user type or persona], I want to [perform a concrete action with specific inputs] so that [I achieve a specific, measurable result or value]",
      "acceptanceCriteria": [
        "Given [precondition], when [action], then [expected result]"
      ]
    }
  ],
  "functionalRequirements": [
    {
      "id": "FR-001",
      "title": "Descriptive Feature Name",
      "description": "Granular explanation of the feature, including input/output parameters, validation rules, state changes, DB interactions, and error responses.",
      "priority": "HIGH"
    }
  ],
  "nonFunctionalRequirements": [
    {
      "id": "NFR-001",
      "category": "PERFORMANCE",
      "description": "Measurable constraint, e.g., 'The unified inbox API must paginate and return results in less than 200ms under 500 concurrent requests/sec.'"
    }
  ],
  "outOfScope": [
    "[Business] Excluded business/GTM goal (e.g. '[Business] Not targeting Fortune 500 in v1')",
    "[Technical] Excluded technical feature (e.g. '[Technical] No native mobile app in v1')"
  ],
  "assumptions": ["Key technical, infrastructural, or user-behavior assumption"],
  "openQuestions": ["Crucial unresolved decision with impact on architecture (e.g., billing, data residency, scopes)"],
  "techStack": {
    "frontend": "Modern frontend stack (e.g., Next.js 14, Tailwind CSS, TypeScript, Radix UI, React Query) with justification.",
    "backend": "Modern backend framework and runtime with details.",
    "database": "Specific database systems (e.g., PostgreSQL with Prisma ORM, Redis for queue caching) and description.",
    "integrations": [
      "Integration 1 (e.g., 'Zendesk REST API v2 using OAuth2')",
      "Integration 2 (e.g., 'Intercom Webhooks via HMAC signature verification')",
      "Integration 3 (e.g., 'HubSpot CRM Cards SDK v3')"
    ],
    "architecture": "A detailed paragraph describing the architectural design patterns, messaging queues (e.g. BullMQ for processing incoming webhook spikes), infrastructure choices (like shared vs separate Redis clusters), and security schemes (e.g. encrypting third-party access tokens in Postgres using AES-256-GCM)."
  },
  "timeline": [
    {
      "phase": "Phase 1: Core Foundation & Ingestion (MVP)",
      "duration": "Weeks 1-8",
      "deliverables": [
        "Deliverable 1 mapping to FR [FR-001] (e.g., 'Setup DB schemas [FR-001]')",
        "Deliverable 2 mapping to FR [FR-002] (e.g., 'Webhook ingestion endpoints [FR-002]')"
      ]
    }
  ],
  "glossary": [
    {
      "term": "Term Name (e.g., SLA)",
      "definition": "Detailed domain-specific definition (e.g., Service Level Agreement: target time window within which support tickets must be answered or resolved)."
    }
  ],
  "versionHistory": [
    {
      "version": "v0.1",
      "date": "2026-06-25",
      "author": "[TBD - Author Name]",
      "description": "Initial draft compiled from product discovery intake sessions."
    }
  ],
  "stakeholders": [
    {
      "role": "Product Owner",
      "name": "[TBD - Owner Name]",
      "approval": "Required"
    },
    {
      "role": "Engineering Lead",
      "name": "[TBD - Owner Name]",
      "approval": "Required"
    }
  ],
  "successMetrics": [
    {
      "metric": "Metric Name (e.g., Average Ticket Resolution Time)",
      "target": "Target value (e.g., Reduce by 25% within 60 days of launch)",
      "measurement": "Exact formula and data sources used to calculate this metric (e.g., 'Sum of (ticket.resolvedAt - ticket.createdAt) / total_tickets, sourced from PostgreSQL session logs')"
    }
  ]
}

Generate at least 5 user stories, 8 functional requirements, 4 non-functional requirements, 6 glossary terms, 3 timeline phases, 3 success metrics, and 3 stakeholders. Ensure there are at least 6-8 open questions.
Return ONLY valid, parseable JSON. Do not write any markdown code blocks, do not write '\`\`\`json', and do not output any surrounding text. Just return raw JSON.
`;

  const result = await generateWithRetry(prompt);
  const response = result.response.text()
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return response;
}

export async function generateEdgeCases(intake: {
  productName: string;
  problemStatement: string;
  targetUser: string;
  coreUseCases: string;
}): Promise<string> {
  const prompt = `
You are a senior QA engineer and product manager. Based on this product description, identify edge cases the team likely hasn't considered.

PRODUCT: ${intake.productName}
PROBLEM: ${intake.problemStatement}
TARGET USER: ${intake.targetUser}
CORE USE CASES: ${intake.coreUseCases}

Return ONLY a JSON array of edge cases in this exact format and nothing else:

[
  {
    "id": "EC-001",
    "category": "Category name (e.g. Data, Auth, Performance, UX)",
    "scenario": "Describe the edge case scenario",
    "impact": "HIGH | MEDIUM | LOW",
    "suggestion": "How to handle this edge case"
  }
]

Return ONLY valid JSON. No markdown, no explanation, no extra text.
`;

  const result = await generateWithRetry(prompt);
    const response = result.response.text()
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return response;
}

export async function generateClarifyingQuestion(
  question: string,
  answer: string
): Promise<string> {
  const prompt = `
You are a senior product manager conducting a product discovery session.

The user was asked: "${question}"
They answered: "${answer}"

Is this answer specific enough to write engineering requirements from? 
If YES, respond with exactly: "SUFFICIENT"
If NO, respond with ONE short follow-up clarifying question (max 15 words).

Respond with ONLY "SUFFICIENT" or the follow-up question. Nothing else.
`;

  const result = await generateWithRetry(prompt);
  const response = result.response.text()
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return response;
}

export interface ValidationResult {
  isValid: boolean;
  feedback?: string | null;
  isSufficient?: boolean;
  clarifyingQuestion?: string | null;
}

export async function validateAnswerRelevance(
  question: string,
  answer: string,
  previousAnswers?: { question: string; answer: string }[],
  shouldClarify?: boolean
): Promise<ValidationResult> {
  let formattedPreviousAnswers = "None yet.";
  if (previousAnswers && previousAnswers.length > 0) {
    formattedPreviousAnswers = previousAnswers
      .map((item, index) => `Question ${index + 1}: "${item.question}"\nUser's Answer: "${item.answer}"`)
      .join("\n\n");
  }

  const prompt = `
You are a senior product manager conducting a product discovery session.
Your job is to determine if the user's answer is relevant to the question asked.

Here are the answers the user has already provided for previous questions:
${formattedPreviousAnswers}

Current Question: "${question}"
User's Answer: "${answer}"

Tasks:
1. Validate if the answer is relevant and addresses the current question. It is INVALID if they copy-pasted/rephrased a previous answer, or if they describe a completely different concept (e.g. describing the problem when asked about features).
${shouldClarify ? `2. Since the user's answer is short, check if it is specific and sufficient enough to write engineering requirements from. If not, generate a short follow-up clarifying question (max 15 words) to prompt them for more specific details.` : ""}

Respond strictly in the following JSON format and nothing else:
{
  "isValid": true | false,
  "feedback": "If invalid, a short reason why and what to provide (max 10 words). Otherwise null.",
  "isSufficient": true | false,
  "clarifyingQuestion": "If valid but not sufficient, the follow-up question. Otherwise null."
}

Do not include any markdown, explanations, or backticks. Return ONLY raw valid JSON.
`;

  try {
    const result = await generateWithRetry(prompt);
    const responseText = result.response.text()
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    
    const parsed = JSON.parse(responseText);
    return {
      isValid: parsed.isValid ?? true,
      feedback: parsed.feedback ?? null,
      isSufficient: parsed.isSufficient ?? true,
      clarifyingQuestion: parsed.clarifyingQuestion ?? null,
    };
  } catch (err) {
    console.error("Combined validation / clarification generation failed:", err);
    return {
      isValid: true,
      isSufficient: true,
      feedback: null,
      clarifyingQuestion: null,
    };
  }
}