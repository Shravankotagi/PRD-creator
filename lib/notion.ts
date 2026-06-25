import { Client } from "@notionhq/client";

export function getNotionClient(accessToken: string) {
  return new Client({ auth: accessToken });
}

export const notionOAuthURL = () => {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID!,
    response_type: "code",
    owner: "user",
    redirect_uri: process.env.NOTION_REDIRECT_URI!,
  });
  return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
};

export async function exchangeNotionCode(code: string) {
  const encoded = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI!,
    }),
  });

  const data = await response.json();
  return data;
}

export async function exportPRDToNotion({
  accessToken,
  prd,
  productName,
}: {
  accessToken: string;
  productName: string;
  prd: {
    executiveSummary: string;
    userStories: Array<{
      id: string;
      title: string;
      story: string;
      acceptanceCriteria: string[];
    }>;
    functionalRequirements: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
    }>;
    nonFunctionalRequirements?: Array<{
      id: string;
      category: string;
      description: string;
    }>;
    outOfScope?: string[];
    assumptions?: string[];
    openQuestions?: string[];
    edgeCases?: Array<{
      id: string;
      category: string;
      scenario: string;
      impact: string;
      suggestion: string;
    }>;
    techStack?: {
      frontend: string;
      backend: string;
      database: string;
      integrations: string[];
      architecture: string;
    } | null;
    timeline?: Array<{
      phase: string;
      duration: string;
      deliverables: string[];
    }> | null;
    glossary?: Array<{
      term: string;
      definition: string;
    }> | null;
    versionHistory?: Array<{
      version: string;
      date: string;
      author: string;
      description: string;
    }> | null;
    stakeholders?: Array<{
      role: string;
      name: string;
      approval: string;
    }> | null;
    successMetrics?: Array<{
      metric: string;
      target: string;
      measurement: string;
    }> | null;
  };
}): Promise<string> {
  const notion = getNotionClient(accessToken);

  const children: any[] = [
    // Executive Summary
    {
      object: "block",
      type: "heading_1",
      heading_1: {
        rich_text: [{ text: { content: "Executive Summary" } }],
      },
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ text: { content: prd.executiveSummary || "" } }],
      },
    },

    // User Stories
    {
      object: "block",
      type: "heading_1",
      heading_1: {
        rich_text: [{ text: { content: "User Stories" } }],
      },
    },
    ...prd.userStories.flatMap((story) => [
      {
        object: "block" as const,
        type: "heading_3" as const,
        heading_3: {
          rich_text: [
            { text: { content: `${story.id} — ${story.title}` } },
          ],
        },
      },
      {
        object: "block" as const,
        type: "paragraph" as const,
        paragraph: {
          rich_text: [{ text: { content: story.story } }],
        },
      },
      ...story.acceptanceCriteria.map((criteria) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ text: { content: criteria } }],
        },
      })),
    ]),

    // Functional Requirements
    {
      object: "block",
      type: "heading_1",
      heading_1: {
        rich_text: [{ text: { content: "Functional Requirements" } }],
      },
    },
    ...prd.functionalRequirements.map((req) => ({
      object: "block" as const,
      type: "bulleted_list_item" as const,
      bulleted_list_item: {
        rich_text: [
          {
            text: {
              content: `[${req.priority}] ${req.id} — ${req.title}: ${req.description}`,
            },
          },
        ],
      },
    })),
  ];

  // Success Metrics
  if (prd.successMetrics && prd.successMetrics.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Success Metrics & KPIs" } }] },
      },
      ...prd.successMetrics.map((m) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ text: { content: `${m.metric} (Target: ${m.target}) — Measurement: ${m.measurement}` } }],
        },
      }))
    );
  }

  // Tech Stack
  if (prd.techStack) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Technology Stack & Architecture" } }] },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { text: { content: `Frontend: ${prd.techStack.frontend}\nBackend: ${prd.techStack.backend}\nDatabase & Caching: ${prd.techStack.database}\nIntegrations: ${prd.techStack.integrations?.join(", ") || ""}` } }
          ]
        }
      }
    );
    if (prd.techStack.architecture) {
      children.push({
        object: "block",
        type: "callout",
        callout: {
          rich_text: [{ text: { content: prd.techStack.architecture } }],
          icon: { emoji: "🛡️" }
        }
      });
    }
  }

  // Timeline
  if (prd.timeline && prd.timeline.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Product Roadmap & Timeline" } }] },
      },
      ...prd.timeline.flatMap((m) => [
        {
          object: "block" as const,
          type: "heading_3" as const,
          heading_3: { rich_text: [{ text: { content: `${m.phase} (${m.duration})` } }] },
        },
        ...m.deliverables.map((del) => ({
          object: "block" as const,
          type: "bulleted_list_item" as const,
          bulleted_list_item: { rich_text: [{ text: { content: del } }] },
        }))
      ])
    );
  }

  // Non-Functional Requirements
  if (prd.nonFunctionalRequirements && prd.nonFunctionalRequirements.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [{ text: { content: "Non-Functional Requirements" } }],
        },
      },
      ...prd.nonFunctionalRequirements.map((req) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ text: { content: `[${req.category}] ${req.id}: ${req.description}` } }],
        },
      }))
    );
  }

  // Out of Scope
  if (prd.outOfScope && prd.outOfScope.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Out of Scope" } }] },
      },
      ...prd.outOfScope.map((item) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: { rich_text: [{ text: { content: item } }] },
      }))
    );
  }

  // Assumptions
  if (prd.assumptions && prd.assumptions.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Assumptions" } }] },
      },
      ...prd.assumptions.map((item) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: { rich_text: [{ text: { content: item } }] },
      }))
    );
  }

  // Open Questions
  if (prd.openQuestions && prd.openQuestions.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Open Questions" } }] },
      },
      ...prd.openQuestions.map((item) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: { rich_text: [{ text: { content: item } }] },
      }))
    );
  }

  // Edge Cases
  if (prd.edgeCases && prd.edgeCases.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Edge Cases" } }] },
      },
      ...prd.edgeCases.map((ec) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ text: { content: `[${ec.impact}] ${ec.id} — ${ec.category}: ${ec.scenario} → ${ec.suggestion}` } }],
        },
      }))
    );
  }

  // Glossary
  if (prd.glossary && prd.glossary.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Domain Glossary" } }] },
      },
      ...prd.glossary.map((item) => ({
        object: "block" as const,
        type: "paragraph" as const,
        paragraph: {
          rich_text: [
            { text: { content: `${item.term}: `, annotations: { bold: true } } },
            { text: { content: item.definition } }
          ]
        }
      }))
    );
  }

  // Stakeholders
  if (prd.stakeholders && prd.stakeholders.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Project Stakeholders" } }] },
      },
      ...prd.stakeholders.map((st) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ text: { content: `${st.role}: ${st.name} (Sign-Off: ${st.approval})` } }],
        },
      }))
    );
  }

  // Version History
  if (prd.versionHistory && prd.versionHistory.length > 0) {
    children.push(
      {
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: "Revision History" } }] },
      },
      ...prd.versionHistory.map((v) => ({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ text: { content: `[${v.version}] ${v.date} by ${v.author} — ${v.description}` } }],
        },
      }))
    );
  }

  const page = await notion.pages.create({
    parent: { type: "workspace", workspace: true },
    properties: {
      title: {
        title: [{ text: { content: `PRD — ${productName}` } }],
      },
    },
    children,
  });

  return (page as any).url ?? "";
}