"use client";

import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExportButtonsProps {
  sessionId: string;
  productName: string;
  notionConnected: boolean;
  notionAccessToken?: string;
  onConnectNotion?: () => void;
}

type ExportState = "idle" | "loading" | "success" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function downloadPDF(sessionId: string, productName: string) {
  const res = await fetch("/api/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to generate PDF");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PRD-${productName.replace(/\s+/g, "-")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportToNotion(
  sessionId: string,
  notionAccessToken: string
): Promise<string> {
  const res = await fetch("/api/export/notion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, notionAccessToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to export to Notion");
  }

  return data.notionPageUrl as string;
}

// ─── Button ───────────────────────────────────────────────────────────────────

function ExportButton({
  onClick,
  state,
  icon,
  label,
  loadingLabel,
  successLabel,
  errorLabel,
  variant = "default",
}: {
  onClick: () => void;
  state: ExportState;
  icon: React.ReactNode;
  label: string;
  loadingLabel: string;
  successLabel: string;
  errorLabel: string;
  variant?: "default" | "notion";
}) {
  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  const base =
    "relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed select-none";

  const variants = {
    default: {
      idle: "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95",
      loading: "bg-indigo-600/60 text-white/70",
      success: "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400",
      error: "bg-red-500/10 border border-red-500/20 text-red-400",
    },
    notion: {
      idle: "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 active:scale-95",
      loading: "bg-slate-700/60 text-slate-400 border border-slate-600/40",
      success: "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400",
      error: "bg-red-500/10 border border-red-500/20 text-red-400",
    },
  };

  const stateStyle = variants[variant][state];
  const currentLabel =
    isLoading ? loadingLabel
    : isSuccess ? successLabel
    : isError ? errorLabel
    : label;

  return (
    <button
      onClick={onClick}
      disabled={isLoading || isSuccess}
      className={`${base} ${stateStyle}`}
    >
      {isLoading ? (
        <svg
          className="w-4 h-4 animate-spin flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : isSuccess ? (
        <svg
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8.5L6.5 12L13 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : isError ? (
        <svg
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 5v4M8 11v1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{currentLabel}</span>
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const PDFIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path
      d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6M9 2l4 4M9 2v4h4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 9h6M5 11.5h4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const NotionIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.5 2.5c0-.8.65-1.4 1.4-1.4l7.2.05c.77.01 1.4.64 1.4 1.4v10.9c0 .77-.63 1.4-1.4 1.4H4.9c-.77 0-1.4-.63-1.4-1.4V2.5zm1.8 1v9.9h5.4V3.5H5.3zm1.2 1.5h3v1.2h-3V5zm0 2.2h3v1.2h-3V7.2zm0 2.1h2v1.2h-2V9.3z" />
  </svg>
);

const ConnectIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path
      d="M6 8h4M8 6l2 2-2 2"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function ExportButtons({
  sessionId,
  productName,
  notionConnected,
  notionAccessToken,
  onConnectNotion,
}: ExportButtonsProps) {
  const [pdfState, setPDFState] = useState<ExportState>("idle");
  const [notionState, setNotionState] = useState<ExportState>("idle");
  const [notionPageUrl, setNotionPageUrl] = useState<string | null>(null);
  const [pdfError, setPDFError] = useState<string | null>(null);
  const [notionError, setNotionError] = useState<string | null>(null);

  async function handlePDFDownload() {
    setPDFState("loading");
    setPDFError(null);
    try {
      await downloadPDF(sessionId, productName);
      setPDFState("success");
      setTimeout(() => setPDFState("idle"), 3000);
    } catch (err) {
      setPDFError(err instanceof Error ? err.message : "Something went wrong");
      setPDFState("error");
      setTimeout(() => setPDFState("idle"), 4000);
    }
  }

  async function handleNotionExport() {
    if (!notionConnected || !notionAccessToken) {
      onConnectNotion?.();
      return;
    }
    setNotionState("loading");
    setNotionError(null);
    try {
      const url = await exportToNotion(sessionId, notionAccessToken);
      setNotionPageUrl(url);
      setNotionState("success");
    } catch (err) {
      setNotionError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setNotionState("error");
      setTimeout(() => setNotionState("idle"), 4000);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Buttons row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* PDF */}
        <ExportButton
          onClick={handlePDFDownload}
          state={pdfState}
          icon={PDFIcon}
          label="Download PDF"
          loadingLabel="Generating PDF…"
          successLabel="Downloaded!"
          errorLabel="Download failed"
          variant="default"
        />

        {/* Notion */}
        {notionConnected ? (
          <ExportButton
            onClick={handleNotionExport}
            state={notionState}
            icon={NotionIcon}
            label="Export to Notion"
            loadingLabel="Exporting…"
            successLabel="Exported to Notion!"
            errorLabel="Export failed"
            variant="notion"
          />
        ) : (
          <button
            onClick={onConnectNotion}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50 hover:border-slate-500 transition-all duration-200 active:scale-95"
          >
            <span>{ConnectIcon}</span>
            Connect Notion
          </button>
        )}
      </div>

      {/* Error messages */}
      {pdfError && pdfState === "error" && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <span>⚠</span> PDF: {pdfError}
        </p>
      )}
      {notionError && notionState === "error" && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <span>⚠</span> Notion: {notionError}
        </p>
      )}

      {/* Notion success link */}
      {notionState === "success" && notionPageUrl && (
        <a
          href={notionPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6h8M6 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Open in Notion →
        </a>
      )}
    </div>
  );
}