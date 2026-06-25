import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { PRD, EdgeCase, FunctionalRequirement, NonFunctionalRequirement, UserStory, SuccessMetric, TechStack, TimelineMilestone, GlossaryTerm, Stakeholder, VersionRevision } from "@/types/prd";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  brand: "#6366F1",
  brandDark: "#4338CA",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  background: "#F9FAFB",
  white: "#FFFFFF",
  priorityHigh: "#EF4444",
  priorityMedium: "#F59E0B",
  priorityLow: "#10B981",
  badgeBg: "#EEF2FF",
  badgeText: "#4338CA",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 48,
    backgroundColor: COLORS.white,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brand,
  },
  headerLeft: {
    flexDirection: "column",
  },
  productName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brand,
    marginBottom: 2,
  },
  docLabel: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerMeta: {
    fontSize: 8,
    color: COLORS.muted,
    textAlign: "right",
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    backgroundColor: COLORS.brand,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brandDark,
  },

  // Body text
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: COLORS.text,
  },

  // User story card
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brandDark,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 9.5,
    color: COLORS.text,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  criteriaLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.muted,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  bullet: {
    fontSize: 9,
    color: COLORS.brand,
    marginRight: 5,
    marginTop: 1,
  },
  criteriaText: {
    fontSize: 9,
    color: COLORS.text,
    lineHeight: 1.4,
    flex: 1,
  },

  // Requirements row
  reqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reqId: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.muted,
    width: 48,
    marginRight: 8,
    marginTop: 1,
  },
  reqContent: {
    flex: 1,
  },
  reqTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  reqDesc: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.4,
  },
  priorityBadge: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: 8,
    marginTop: 1,
  },

  // NFR row
  nfrRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryBadge: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.badgeText,
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    width: 90,
    marginRight: 10,
    textAlign: "center",
  },
  nfrDesc: {
    fontSize: 9,
    color: COLORS.text,
    lineHeight: 1.4,
    flex: 1,
  },

  // Simple list
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  listBullet: {
    fontSize: 9,
    color: COLORS.brand,
    marginRight: 6,
    marginTop: 1,
  },
  listText: {
    fontSize: 9.5,
    color: COLORS.text,
    lineHeight: 1.5,
    flex: 1,
  },

  // Edge case card
  edgeCard: {
    backgroundColor: COLORS.background,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  edgeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  edgeId: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.muted,
    marginRight: 6,
  },
  edgeCategory: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
  },
  edgeScenario: {
    fontSize: 9,
    color: COLORS.text,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  edgeSuggestion: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.4,
    fontFamily: "Helvetica-Oblique",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
    color: COLORS.muted,
  },
});

// ─── Priority badge color helper ──────────────────────────────────────────────

function priorityColor(priority: string) {
  switch (priority) {
    case "HIGH":
      return { backgroundColor: "#FEE2E2", color: COLORS.priorityHigh };
    case "MEDIUM":
      return { backgroundColor: "#FEF3C7", color: COLORS.priorityMedium };
    case "LOW":
      return { backgroundColor: "#D1FAE5", color: COLORS.priorityLow };
    default:
      return { backgroundColor: COLORS.badgeBg, color: COLORS.badgeText };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.listBullet}>•</Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function UserStoryCard({ story }: { story: UserStory }) {
  if (!story) return null;
  const criteria = story.acceptanceCriteria ?? [];
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {story.id} — {story.title}
      </Text>
      <Text style={styles.cardBody}>{story.story}</Text>
      {criteria.length > 0 && (
        <View>
          <Text style={styles.criteriaLabel}>Acceptance Criteria</Text>
          {criteria.map((criterion, i) => (
            <View key={i} style={styles.criteriaItem}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.criteriaText}>{criterion}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function FunctionalRequirementRow({ req }: { req: FunctionalRequirement }) {
  const badgeStyle = priorityColor(req.priority);
  return (
    <View style={styles.reqRow}>
      <Text style={styles.reqId}>{req.id}</Text>
      <View style={styles.reqContent}>
        <Text style={styles.reqTitle}>{req.title}</Text>
        <Text style={styles.reqDesc}>{req.description}</Text>
      </View>
      <Text style={[styles.priorityBadge, badgeStyle]}>{req.priority}</Text>
    </View>
  );
}

function NonFunctionalRequirementRow({ req }: { req: NonFunctionalRequirement }) {
  return (
    <View style={styles.nfrRow}>
      <Text style={styles.categoryBadge}>{req.category}</Text>
      <Text style={styles.nfrDesc}>{req.description}</Text>
    </View>
  );
}

function EdgeCaseCard({ ec }: { ec: EdgeCase }) {
  const impactStyle = priorityColor(ec.impact);
  return (
    <View style={styles.edgeCard}>
      <View style={styles.edgeHeader}>
        <Text style={styles.edgeId}>{ec.id}</Text>
        <Text style={styles.edgeCategory}>{ec.category}</Text>
        <Text style={[styles.priorityBadge, impactStyle, { marginLeft: 8 }]}>
          {ec.impact}
        </Text>
      </View>
      <Text style={styles.edgeScenario}>{ec.scenario}</Text>
      <Text style={styles.edgeSuggestion}>→ {ec.suggestion}</Text>
    </View>
  );
}

function SuccessMetricRow({ metric, target, measurement }: SuccessMetric) {
  return (
    <View style={[styles.reqRow, { paddingVertical: 8 }]}>
      <View style={styles.reqContent}>
        <Text style={styles.reqTitle}>{metric}</Text>
        <Text style={[styles.reqDesc, { color: COLORS.brandDark, fontFamily: "Helvetica-Bold" }]}>Target: {target}</Text>
        <Text style={[styles.reqDesc, { marginTop: 2 }]}>Measurement: {measurement}</Text>
      </View>
    </View>
  );
}

function TechStackBlock({ techStack }: { techStack: TechStack }) {
  return (
    <View style={{ gap: 6, marginTop: 4 }}>
      <View style={{ flexDirection: "row", marginBottom: 3 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", width: 100, fontSize: 9 }}>Frontend Stack:</Text>
        <Text style={{ flex: 1, fontSize: 9 }}>{techStack.frontend}</Text>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 3 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", width: 100, fontSize: 9 }}>Backend Stack:</Text>
        <Text style={{ flex: 1, fontSize: 9 }}>{techStack.backend}</Text>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 3 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", width: 100, fontSize: 9 }}>Database & Caching:</Text>
        <Text style={{ flex: 1, fontSize: 9 }}>{techStack.database}</Text>
      </View>
      <View style={{ flexDirection: "row", marginBottom: 3 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", width: 100, fontSize: 9 }}>Key Integrations:</Text>
        <Text style={{ flex: 1, fontSize: 9 }}>{techStack.integrations?.join(", ")}</Text>
      </View>
      {techStack.architecture && (
        <View style={{ marginTop: 4, padding: 6, backgroundColor: COLORS.background, borderRadius: 4 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: COLORS.brandDark, marginBottom: 2 }}>Architecture & Security</Text>
          <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{techStack.architecture}</Text>
        </View>
      )}
    </View>
  );
}

function TimelineMilestoneRow({ milestone }: { milestone: TimelineMilestone }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{milestone.phase} ({milestone.duration})</Text>
      <Text style={styles.criteriaLabel}>Deliverables</Text>
      {milestone.deliverables?.map((del, i) => (
        <View key={i} style={styles.criteriaItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.criteriaText}>{del}</Text>
        </View>
      ))}
    </View>
  );
}

function GlossaryRow({ term, definition }: GlossaryTerm) {
  return (
    <View style={{ paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.brandDark }}>{term}</Text>
      <Text style={{ fontSize: 9, color: COLORS.text, lineHeight: 1.4, marginTop: 1 }}>{definition}</Text>
    </View>
  );
}

function StakeholderRow({ stakeholder }: { stakeholder: Stakeholder }) {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: COLORS.border, fontSize: 9 }}>
      <Text style={{ width: 150, fontFamily: "Helvetica-Bold" }}>{stakeholder.role}</Text>
      <Text style={{ width: 200 }}>{stakeholder.name}</Text>
      <Text style={{ flex: 1, color: COLORS.brandDark, fontFamily: "Helvetica-Bold" }}>{stakeholder.approval}</Text>
    </View>
  );
}

function VersionRevisionRow({ rev }: { rev: VersionRevision }) {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: COLORS.border, fontSize: 9 }}>
      <Text style={{ width: 60, fontFamily: "Helvetica-Bold", color: COLORS.brand }}>{rev.version}</Text>
      <Text style={{ width: 80 }}>{rev.date}</Text>
      <Text style={{ width: 120 }}>{rev.author}</Text>
      <Text style={{ flex: 1 }}>{rev.description}</Text>
    </View>
  );
}

// ─── Main Document ────────────────────────────────────────────────────────────

interface PRDDocumentProps {
  productName: string;
  prd: PRD;
  generatedAt?: string;
}

export function PRDDocument({ productName, prd, generatedAt }: PRDDocumentProps) {
  const dateStr = generatedAt ?? new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`PRD — ${productName}`}
      author="PRD Generator"
      subject="Product Requirements Document"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.docLabel}>Product Requirements Document</Text>
          </View>
          <Text style={styles.headerMeta}>{dateStr}</Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <SectionHeading title="Executive Summary" />
          <Text style={styles.bodyText}>{prd.executiveSummary}</Text>
        </View>

        {/* User Stories */}
        <View style={styles.section}>
          <SectionHeading title="User Stories" />
          {(prd.userStories ?? []).map((story) => (
            <UserStoryCard key={story.id} story={story} />
          ))}
        </View>

        {/* Functional Requirements */}
        <View style={styles.section}>
          <SectionHeading title="Functional Requirements" />
          {(prd.functionalRequirements ?? []).map((req) => (
            <FunctionalRequirementRow key={req.id} req={req} />
          ))}
        </View>

        {/* Non-Functional Requirements */}
        <View style={styles.section}>
          <SectionHeading title="Non-Functional Requirements" />
          {(prd.nonFunctionalRequirements ?? []).map((req) => (
            <NonFunctionalRequirementRow key={req.id} req={req} />
          ))}
        </View>

        {/* Out of Scope */}
        <View style={styles.section}>
          <SectionHeading title="Out of Scope" />
          <BulletList items={prd.outOfScope} />
        </View>

        {/* Assumptions */}
        <View style={styles.section}>
          <SectionHeading title="Assumptions" />
          <BulletList items={prd.assumptions} />
        </View>

        {/* Open Questions */}
        <View style={styles.section}>
          <SectionHeading title="Open Questions" />
          <BulletList items={prd.openQuestions} />
        </View>

        {/* Edge Cases */}
        <View style={styles.section}>
          <SectionHeading title="Edge Cases" />
          {(prd.edgeCases ?? []).map((ec) => (
            <EdgeCaseCard key={ec.id} ec={ec} />
          ))}
        </View>

        {/* Success Metrics */}
        {prd.successMetrics && prd.successMetrics.length > 0 && (
          <View style={styles.section}>
            <SectionHeading title="Success Metrics & KPIs" />
            {prd.successMetrics.map((m, i) => (
              <SuccessMetricRow key={i} {...m} />
            ))}
          </View>
        )}

        {/* Tech Stack */}
        {prd.techStack && (
          <View style={styles.section}>
            <SectionHeading title="Technology Stack & Architecture" />
            <TechStackBlock techStack={prd.techStack} />
          </View>
        )}

        {/* Timeline */}
        {prd.timeline && prd.timeline.length > 0 && (
          <View style={styles.section}>
            <SectionHeading title="Product Roadmap & Milestones" />
            {prd.timeline.map((m, i) => (
              <TimelineMilestoneRow key={i} milestone={m} />
            ))}
          </View>
        )}

        {/* Glossary */}
        {prd.glossary && prd.glossary.length > 0 && (
          <View style={styles.section}>
            <SectionHeading title="Domain Glossary" />
            {prd.glossary.map((item, i) => (
              <GlossaryRow key={i} {...item} />
            ))}
          </View>
        )}

        {/* Stakeholders */}
        {prd.stakeholders && prd.stakeholders.length > 0 && (
          <View style={styles.section}>
            <SectionHeading title="Project Stakeholders" />
            <View style={{ flexDirection: "row", paddingVertical: 4, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border, fontSize: 9, fontFamily: "Helvetica-Bold" }}>
              <Text style={{ width: 150 }}>Role</Text>
              <Text style={{ width: 200 }}>Name</Text>
              <Text style={{ flex: 1 }}>Sign-Off</Text>
            </View>
            {prd.stakeholders.map((st, i) => (
              <StakeholderRow key={i} stakeholder={st} />
            ))}
          </View>
        )}

        {/* Version History */}
        {prd.versionHistory && prd.versionHistory.length > 0 && (
          <View style={styles.section}>
            <SectionHeading title="Revision & Version History" />
            <View style={{ flexDirection: "row", paddingVertical: 4, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border, fontSize: 9, fontFamily: "Helvetica-Bold" }}>
              <Text style={{ width: 60 }}>Version</Text>
              <Text style={{ width: 80 }}>Date</Text>
              <Text style={{ width: 120 }}>Author</Text>
              <Text style={{ flex: 1 }}>Description</Text>
            </View>
            {prd.versionHistory.map((v, i) => (
              <VersionRevisionRow key={i} rev={v} />
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>PRD — {productName}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}