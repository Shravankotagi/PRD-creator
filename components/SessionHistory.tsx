"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionSummary {
  id: string;
  status: "IN_PROGRESS" | "GENERATING" | "REVIEW" | "COMPLETED" | "ACCEPTED";
  createdAt: string;
  updatedAt: string;
  notionPageUrl?: string | null;
  intake?: {
    answers?: {
      productName?: string;
    };
  } | null;
}

interface SessionHistoryProps {
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusMeta(status: SessionSummary["status"]): {
  label: string;
  className: string;
  dot: string;
} {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Completed",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-400",
      };
    case "ACCEPTED":
      return {
        label: "Accepted",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-400",
      };
    case "REVIEW":
      return {
        label: "Review",
        className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        dot: "bg-indigo-400",
      };
    case "GENERATING":
      return {
        label: "Generating",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dot: "bg-amber-400 animate-pulse",
      };
    case "IN_PROGRESS":
    default:
      return {
        label: "In Progress",
        className: "bg-slate-700/50 text-slate-400 border-slate-600/30",
        dot: "bg-slate-400",
      };
  }
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-slate-600" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 2h8a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 6h4M8 9h4M8 12h2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-400">No PRDs yet</p>
      <p className="text-xs text-slate-600 mt-1">
        Your generated PRDs will appear here.
      </p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-4 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-700/60 rounded-full w-40" />
        <div className="h-2.5 bg-slate-700/40 rounded-full w-24" />
      </div>
      <div className="h-5 w-16 bg-slate-700/40 rounded-full" />
      <div className="h-3 w-8 bg-slate-700/30 rounded-full" />
    </div>
  );
}

// ─── Session Row ──────────────────────────────────────────────────────────────

function SessionRow({ session }: { session: SessionSummary }) {
  const productName =
    session.intake?.answers?.productName ?? "Untitled Product";
  const { label, className, dot } = statusMeta(session.status);
  const canView = session.status === "REVIEW" || session.status === "COMPLETED" || session.status === "ACCEPTED";

  return (
    <div className="group flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-slate-800/40 transition-colors duration-150 border border-transparent hover:border-slate-700/40">
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-indigo-400"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">
          {productName}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatDate(session.createdAt)}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex-shrink-0 ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>

      {/* Notion link */}
      {session.notionPageUrl && (
        <a
          href={session.notionPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 text-slate-600 hover:text-slate-300 transition-colors duration-150"
          title="Open in Notion"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="currentColor">
            <path d="M2.5 2c0-.55.45-1 1-1l7 .04c.55 0 1 .45 1 1v9c0 .55-.45 1-1 1H3.5c-.55 0-1-.45-1-1V2zm1.5.75v8.5h5.5V2.75H4zm1 1.25h3.5v1H5V4zm0 2h3.5v1H5V6zm0 2h2.5v1H5V8z" />
          </svg>
        </a>
      )}

      {/* View link */}
      {canView ? (
        <Link
          href={`/prd/${session.id}`}
          className="flex-shrink-0 text-xs font-medium text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center gap-1"
        >
          View
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6h7M6.5 3l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : (
        <span className="w-10 flex-shrink-0" />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SessionHistory({ className = "" }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/sessions");
        if (!res.ok) throw new Error("Failed to load sessions");
        const data = await res.json();
        setSessions(data.sessions ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-300 tracking-tight">
          Past PRDs
        </h2>
        {!loading && sessions.length > 0 && (
          <span className="text-xs text-slate-600">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-700/30">
            {[...Array(3)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <svg
              className="w-4 h-4 text-red-400"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 5v4M8 10.5v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-slate-700/30">
            {sessions.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}