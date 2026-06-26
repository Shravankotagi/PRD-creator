"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

interface PRDSession {
  id: string;
  createdAt: string;
  status: string;
  prd?: { id: string; title: string; createdAt: string };
  intake?: { answers: Record<string, string> };
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; dotColor: string; bg: string; color: string }> = {
    COMPLETED:   { label: "Completed",   dotColor: "#22c55e", bg: "#dcfce7", color: "#166534" },
    IN_PROGRESS: { label: "In Progress", dotColor: "#3b82f6", bg: "#dbeafe", color: "#1e40af" },
    GENERATING:  { label: "Generating",  dotColor: "#a855f7", bg: "#f3e8ff", color: "#6b21a8" },
    REVIEW:      { label: "Review",      dotColor: "#eab308", bg: "#fef9c3", color: "#854d0e" },
    ACCEPTED:    { label: "Accepted",    dotColor: "#10b981", bg: "#ecfdf5", color: "#065f46" },
    PENDING:     { label: "Pending",     dotColor: "#3b82f6", bg: "#dbeafe", color: "#1e40af" },
    FAILED:      { label: "Failed",      dotColor: "#ef4444", bg: "#fee2e2", color: "#991b1b" },
  };
  const s = map[status] ?? { label: status, dotColor: "#9ca3af", bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: s.color,
      background: s.bg,
      padding: "4px 12px",
      borderRadius: 999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dotColor, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4].map(i => (
      <tr key={i} className="border-b border-slate-100 last:border-0">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="w-28 h-4 bg-slate-100 rounded animate-pulse" />
              <div className="w-16 h-3 bg-slate-50 rounded animate-pulse" />
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 animate-pulse" />
            <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="w-32 h-4 bg-slate-100 rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
          <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
          <div className="w-24 h-6 bg-slate-100 rounded-full animate-pulse" />
        </td>
        <td className="px-6 py-4 text-right">
          <div className="inline-flex gap-3">
            <div className="w-14 h-4 bg-slate-100 rounded animate-pulse" />
            <div className="w-10 h-4 bg-slate-100 rounded animate-pulse" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<PRDSession[]>([]);
  const [loading, setLoading]   = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard")
      .then(r => {
        if (r.status === 401) {
          router.push("/sign-in");
          throw new Error("Unauthorized");
        }
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(d => {
        if (!active) return;
        setSessions(d.sessions ?? []);
        setLoading(false);
      })
      .catch(err => {
        if (!active) return;
        if (err.message !== "Unauthorized") {
          console.error(err);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this PRD? This cannot be undone.")) return;
    setDeletingIds(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/session/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleNewPRD = () => router.push("/intake");

  const user            = session?.user;
  const firstName       = user?.name ? user.name.split(" ")[0] : "there";
  const completedCount  = sessions.filter(s => ["COMPLETED", "ACCEPTED"].includes(s.status)).length;
  const inProgressCount = sessions.filter(s => ["IN_PROGRESS","GENERATING","REVIEW","PENDING"].includes(s.status)).length;
  const failedCount     = sessions.filter(s => s.status === "FAILED").length;

  if (isPending) return null;

  const stats = [
    { label: "TOTAL SESSIONS", value: sessions.length, border: "#2563eb" },
    { label: "TOTAL PRDs GENERATED", value: completedCount, border: "#2563eb" },
    { label: "IN PROGRESS", value: inProgressCount, border: "#2563eb" },
    { label: "FAILED SESSIONS", value: failedCount, border: "#dc2626" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#0d1b3e" }}>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <BrandLogo href="/dashboard" />
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewPRD}
              className="flex items-center gap-1 bg-[#1a3aff] text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-sm hover:bg-blue-700 transition-all"
            >
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="hidden min-[390px]:inline">Create Session</span>
              <span className="inline min-[390px]:hidden">Create</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full overflow-hidden focus:outline-none flex items-center justify-center bg-blue-600 text-white font-bold text-sm shadow-sm transition-transform hover:scale-105"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{firstName[0]?.toUpperCase()}</span>
                )}
              </button>

              {menuOpen && (
                <>
                  <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-400">
                        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                      Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        await authClient.signOut();
                        router.push("/sign-in");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400">
                        <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content area ── */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#0d1b3e] tracking-tight">User Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor all PRD generation sessions and intake histories.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${stat.border}`,
              borderRadius: 16,
              padding: "20px 24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em" }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0d1b3e", marginTop: 6, lineHeight: 1 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Sessions Table Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white">
            <h2 className="text-base font-bold text-[#1a3aff]">Recent PRD Sessions</h2>
            <div className="flex items-center gap-3.5">
              {!loading && (
                <span className="text-xs text-slate-400 font-medium">
                  Showing 1-{sessions.length} of {sessions.length}
                </span>
              )}
              
            </div>
          </div>

          {/* Table container */}
          {/* Mobile card list */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="w-32 h-4 bg-slate-100 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-slate-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="px-6 py-16 text-center text-slate-400 flex flex-col items-center gap-3">
                <p className="font-bold text-slate-800 text-sm">No PRD sessions yet</p>
                <button onClick={handleNewPRD} className="bg-[#1a3aff] text-white px-4 py-2 rounded-xl text-xs font-bold">+ Create Session</button>
              </div>
            ) : sessions.map(session => {
              const title = session.intake?.answers?.product_name || session.prd?.title || "Untitled PRD";
              const dateStr = new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const productInitial = title[0]?.toUpperCase() || "P";
              const isDeleting = deletingIds[session.id] ?? false;
              return (
                <div key={session.id} className="px-4 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer"
                  onClick={() => session.prd?.id ? router.push(`/prd/${session.prd.id}`) : router.push(`/intake?sessionId=${session.id}`)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#1a3aff] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {productInitial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 text-sm truncate">{title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{dateStr}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={session.status} />
                    <button onClick={e => { e.stopPropagation(); handleDelete(session.id); }} disabled={isDeleting}
                      className="text-red-500 text-xs font-semibold disabled:opacity-50 px-1">
                      {isDeleting ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[28%]">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[20%]">Creator</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[20%]">Target Audience</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[12%]">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[10%]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">No PRD sessions yet</p>
                          <p className="text-xs text-slate-400 mt-1">Start by creating your first session to generate a PRD.</p>
                        </div>
                        <button
                          onClick={handleNewPRD}
                          className="mt-2 bg-[#1a3aff] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all"
                        >
                          + Create Session
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sessions.map(session => {
                    const title = session.intake?.answers?.product_name || session.prd?.title || "Untitled PRD";
                    const targetAudience = session.intake?.answers?.target_audience || "General Public";
                    const dateStr = new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const productInitial = title[0]?.toUpperCase() || "P";
                    const creatorInitial = firstName[0]?.toUpperCase() || "U";
                    const creatorName = user?.name ?? "Smith Demo";
                    const isDeleting = deletingIds[session.id] ?? false;

                    return (
                      <tr
                        key={session.id}
                        onClick={() => {
                          if (session.prd?.id) {
                            router.push(`/prd/${session.prd.id}`);
                          } else {
                            router.push(`/intake?sessionId=${session.id}`);
                          }
                        }}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-5 max-w-[280px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1a3aff] flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {productInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-800 text-sm truncate" title={title}>{title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                              {creatorInitial}
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{creatorName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 max-w-[200px] truncate">
                          {targetAudience}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                          {dateStr}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <StatusBadge status={session.status} />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(session.id);
                              }}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors text-xs font-semibold"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}