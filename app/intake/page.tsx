"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BrandLogo from "@/components/BrandLogo";

const STATUS_STEPS = [
  "Analyzing your answers...",
  "Drafting executive summary & scope...",
  "Creating detailed user stories & criteria...",
  "Analyzing edge cases & constraints...",
  "Polishing and formatting document..."
];

const INTAKE_QUESTIONS = [
  {
    id: "product_name",
    question: "What is the name of your product or feature?",
    placeholder: "e.g. Stripe Dashboard, Slack Threads, Notion AI...",
  },
  {
    id: "problem_statement",
    question: "What problem does it solve? Who experiences this problem?",
    placeholder: "Describe the pain point and the target users...",
  },
  {
    id: "target_users",
    question: "Who are your primary users? Describe them in detail.",
    placeholder: "e.g. B2B SaaS founders, enterprise procurement teams...",
  },
  {
    id: "core_features",
    question: "What are the core features or capabilities you envision?",
    placeholder: "List the key things users should be able to do...",
  },
  {
    id: "success_metrics",
    question: "How will you measure success? What does a win look like?",
    placeholder: "e.g. 30% reduction in churn, 10k DAU within 3 months...",
  },
  {
    id: "constraints",
    question: "What are your technical, business, or timeline constraints?",
    placeholder: "Budget, tech stack, compliance requirements, deadlines...",
  },
  {
    id: "non_goals",
    question: "What is explicitly out of scope? List both Business/GTM non-goals (e.g. not targeting enterprise contracts in v1) and Technical non-goals (e.g. no mobile app).",
    placeholder: "e.g. Business: Not targeting enterprise/Fortune 500 in v1. Technical: No native mobile app, no custom analytics reporting...",
  },
];

interface Message {
  role: "assistant" | "user";
  content: string;
  questionId?: string;
}

function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "5px 10px 5px 6px",
          cursor: "pointer", transition: "background 0.15s",
        }}
      >
        {user?.image ? (
          <img src={user.image} alt="avatar" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />
        ) : (
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "linear-gradient(135deg,#7c5cff,#5a35e8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#374151",
          }}>{firstName[0]?.toUpperCase()}</div>
        )}
        <span style={{ fontSize: 13, color: "#374151", fontFamily: "inherit" }}>
          {firstName}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ color: "#94a3b8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
          />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            minWidth: 200, zIndex: 50,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 12, padding: 6,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{
              padding: "10px 12px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              marginBottom: 4,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0d1b3e" }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                {user?.email}
              </div>
            </div>

            <a
              href="/dashboard"
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "9px 12px", borderRadius: 8, textDecoration: "none",
                color: "#374151", fontSize: 13,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Dashboard
            </a>

            <button
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/sign-in";
              }}
              style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "9px 12px", borderRadius: 8,
                background: "none", border: "none", cursor: "pointer",
                color: "#374151", fontSize: 13, fontFamily: "inherit",
                textAlign: "left", transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,80,80,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function IntakeContent() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoaded = !isPending;
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSessionId = searchParams.get("sessionId");

  const firstName = user?.name ? user.name.split(" ")[0] : "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
  const [awaitingClarification, setAwaitingClarification] = useState(false);

  const [isGeneratingPRD, setIsGeneratingPRD] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isGeneratingPRD) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGeneratingPRD]);

  // FIX 1: Prevent re-initialization on Clerk token refresh / user object change
  const hasInitialized = useRef(false);
  // FIX 2: Track which question index triggered the clarifying question
  const clarifyingQuestionIndexRef = useRef<number | null>(null);

  // Load previous answers if editing
  useEffect(() => {
    if (!editSessionId || !isLoaded || !user) return;
    async function loadEditSession() {
      try {
        const res = await fetch(`/api/session?id=${editSessionId}`);
        const data = await res.json();
        if (data.session && data.session.intake) {
          const intake = data.session.intake;
          const loadedAnswers: Record<string, string> = {
            product_name: intake.productName || "",
            problem_statement: intake.problemStatement || "",
            target_users: intake.targetUser || "",
            core_features: intake.coreUseCases || "",
            success_metrics: intake.successMetrics || "",
            constraints: intake.knownConstraints || "",
            non_goals: intake.nonGoals || "",
          };
          setAnswers(loadedAnswers);
          setSessionId(editSessionId);
          setInputValue(loadedAnswers[INTAKE_QUESTIONS[0].id] || "");
        }
      } catch (err) {
        console.error("Failed to load edit session", err);
      }
    }
    loadEditSession();
  }, [editSessionId, isLoaded, user]);

  // Initialize session and show first question
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }
    
    // Guard: only run once even if user/isLoaded changes reference
    if (hasInitialized.current) return;
    hasInitialized.current = true;


    setIsTyping(true);
    setTimeout(() => {
      const welcomeMsg = editSessionId
        ? `Welcome back${firstName ? ` ${firstName}` : ""}! Let's modify your PRD. I've pre-filled your previous answers. Press Enter to keep them, or write your edits.`
        : `Hey${firstName ? ` ${firstName}` : ""}! I'm going to help you craft a world-class PRD. I'll ask you ${INTAKE_QUESTIONS.length} questions — just be as specific as you can. Let's start.`;

      setMessages([
        {
          role: "assistant",
          content: welcomeMsg,
        },
      ]);
      setIsTyping(false);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: INTAKE_QUESTIONS[0].question,
              questionId: INTAKE_QUESTIONS[0].id,
            },
          ]);
          setIsTyping(false);
        }, 800);
      }, 600);
    }, 1000);
  }, [isLoaded, user, router, editSessionId]);

  const addAssistantMessage = useCallback((content: string, questionId?: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content, questionId }]);
        setIsTyping(false);
        resolve();
      }, 700 + Math.random() * 400);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);

    // Show the user's message immediately — before any async network calls
    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      if (currentQuestionIndex === 0 && !sessionId) {
        try {
          const res = await fetch("/api/session/create", { method: "POST" });
          const data = await res.json();
          if (!res.ok) {
            if (data.error === "LIMIT_REACHED") {
              alert(data.message || "You have reached your session limit. Please upgrade to Pro.");
              router.push("/pricing");
              return;
            }
            throw new Error(data.error || "Failed to create session");
          }
          setSessionId(data.sessionId);
        } catch (err: any) {
          console.error("Failed to create session:", err);
          alert(err.message || "Failed to start session. Please try again.");
          return;
        }
      }

      // Validate answer relevance
      const previousAnswers = INTAKE_QUESTIONS.slice(0, currentQuestionIndex).map(q => ({
        question: q.question,
        answer: answers[q.id] || ""
      })).filter(item => item.answer.trim() !== "");

      const currentQuestion = awaitingClarification 
        ? clarifyingQuestion 
        : INTAKE_QUESTIONS[currentQuestionIndex]?.question;

      const questionId = awaitingClarification ? null : INTAKE_QUESTIONS[currentQuestionIndex]?.id;
      const nextIndex = currentQuestionIndex + 1;
      const shouldClarify = !awaitingClarification && questionId !== "product_name" && trimmed.length < 150;

      let valData = { isValid: true, isSufficient: true, feedback: null, clarifyingQuestion: null };

      if (currentQuestion) {
        try {
          const valRes = await fetch("/api/intake/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              question: currentQuestion, 
              answer: trimmed,
              previousAnswers,
              shouldClarify
            }),
          });
          valData = await valRes.json();
          if (!valData.isValid) {
            await addAssistantMessage(valData.feedback || "Please provide a relevant answer to the question.");
            return;
          }
        } catch (err) {
          console.error("Validation failed:", err);
        }
      }

      // Handle clarifying question response
      if (awaitingClarification) {
        // FIX 2: Use the saved ref index instead of currentQuestionIndex - 1
        const clarifiedIndex = clarifyingQuestionIndexRef.current!;
        const updatedAnswers = {
          ...answers,
          [INTAKE_QUESTIONS[clarifiedIndex].id]:
            answers[INTAKE_QUESTIONS[clarifiedIndex].id] + "\n\nAdditional context: " + trimmed,
        };
        setAnswers(updatedAnswers);
        setAwaitingClarification(false);
        setClarifyingQuestion(null);
        clarifyingQuestionIndexRef.current = null; // clean up

        if (currentQuestionIndex >= INTAKE_QUESTIONS.length) {
          await finishIntake(updatedAnswers);
        } else {
          // Pre-fill next question's answer if editing
          const nextQuestionId = INTAKE_QUESTIONS[currentQuestionIndex].id;
          if (updatedAnswers[nextQuestionId]) {
            setInputValue(updatedAnswers[nextQuestionId]);
          } else {
            setInputValue("");
          }

          await addAssistantMessage(
            INTAKE_QUESTIONS[currentQuestionIndex].question,
            INTAKE_QUESTIONS[currentQuestionIndex].id
          );
        }
        return;
      }

      const updatedAnswers = { ...answers, [questionId!]: trimmed };
      setAnswers(updatedAnswers);

      if (shouldClarify && !valData.isSufficient && valData.clarifyingQuestion) {
        // Save the current index BEFORE incrementing
        clarifyingQuestionIndexRef.current = currentQuestionIndex;
        setClarifyingQuestion(valData.clarifyingQuestion);
        setAwaitingClarification(true);
        setCurrentQuestionIndex(nextIndex);
        await addAssistantMessage(valData.clarifyingQuestion);
        return;
      }

      setCurrentQuestionIndex(nextIndex);

      if (nextIndex >= INTAKE_QUESTIONS.length) {
        await finishIntake(updatedAnswers);
      } else {
        // Pre-fill next question's answer if editing
        const nextQuestionId = INTAKE_QUESTIONS[nextIndex].id;
        if (updatedAnswers[nextQuestionId]) {
          setInputValue(updatedAnswers[nextQuestionId]);
        } else {
          setInputValue("");
        }

        const acks = [
          "Got it.",
          "Perfect.",
          "Great.",
          "Noted.",
          "Understood.",
          "Nice.",
          "Love it.",
        ];
        const ack = acks[Math.floor(Math.random() * acks.length)];
        await addAssistantMessage(
          `${ack} ${INTAKE_QUESTIONS[nextIndex].question}`,
          INTAKE_QUESTIONS[nextIndex].id
        );
      }
    } catch (error) {
      console.error("Submission processing error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [inputValue, isSubmitting, awaitingClarification, answers, currentQuestionIndex, addAssistantMessage, sessionId]);

  const finishIntake = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    setIsGeneratingPRD(true);
    await addAssistantMessage(
      "Excellent! I have everything I need. Generating your PRD now — this usually takes about 15–20 seconds..."
    );

    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, sessionId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Submission failed");

      setIsComplete(true);
      await addAssistantMessage("Your PRD is ready! Redirecting you now...");

      setTimeout(() => {
        router.push(`/prd/${data.prdId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setIsGeneratingPRD(false);
      await addAssistantMessage(
        "Something went wrong generating your PRD. Please try again or contact support."
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const progress = Math.min(
    Math.round((currentQuestionIndex / INTAKE_QUESTIONS.length) * 100),
    100
  );

  if (!isLoaded) return null;

  return (
    <div className="intake-root">
      <div className="intake-bg" />

      <header className="intake-header">
        <BrandLogo href="/dashboard" />
        <div className="intake-progress-wrap">
          <span className="progress-label">
            {isComplete ? "Complete" : `${currentQuestionIndex} of ${INTAKE_QUESTIONS.length}`}
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <UserMenu user={user} />
      </header>

      <main className="intake-main">
        <div className="chat-container">
          <div className="messages-wrap">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row message-row--${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="avatar">
                    <span>◈</span>
                  </div>
                )}
                <div className={`bubble bubble--${msg.role}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {((isSubmitting || isTyping) && !isGeneratingPRD) && (
              <div className="message-row message-row--assistant animate-fade-in">
                <div className="avatar">
                  <span>◈</span>
                </div>
                <div className="bubble bubble--assistant bubble--typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
          </div>

          {!isComplete && (
            <div className="input-area">
              <div className="input-wrap">
                <textarea
                  className="chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    currentQuestionIndex < INTAKE_QUESTIONS.length
                      ? INTAKE_QUESTIONS[
                          awaitingClarification
                            ? clarifyingQuestionIndexRef.current ?? currentQuestionIndex
                            : currentQuestionIndex
                        ]?.placeholder
                      : "Processing..."
                  }
                  disabled={isSubmitting || isTyping}
                  rows={3}
                  autoFocus
                />
                <button
                  className="send-btn"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isSubmitting || isTyping}
                  aria-label="Send"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
            </div>
          )}
        </div>
      </main>

      {isGeneratingPRD && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/70 backdrop-blur-md animate-fade-in">
          {/* Dotted Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
          
          {/* Clean White Elevated Container */}
          <div className="relative bg-white border border-slate-200/80 p-10 rounded-2xl max-w-md w-full mx-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center overflow-hidden group">
            
            {/* Royal Blue Circular Progress */}
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              {/* Outer ring track */}
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
              {/* Active royal blue spinning segment */}
              <div className="absolute inset-0 border-4 border-t-el-blue border-r-el-blue rounded-full animate-spin [animation-duration:1.2s]" />
              
              {/* Clean Blue Outlined Icon */}
              <div className="relative w-14 h-14 bg-el-blue-light/50 rounded-xl border border-blue-100 flex items-center justify-center text-el-blue shadow-sm animate-pulse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>

              {/* Floating particles in brand blue */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-el-blue rounded-full animate-ping [animation-duration:1.5s]" />
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping [animation-duration:2.5s]" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
              Generating Your PRD
            </h3>
            
            <div className="h-6 flex items-center justify-center mb-6">
              <p className="text-el-blue text-xs font-extrabold uppercase tracking-widest animate-pulse">
                {STATUS_STEPS[stepIndex]}
              </p>
            </div>

            {/* Horizontal progress details */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Compilation Status</span>
                <span className="text-el-blue">{Math.min((stepIndex + 1) * 20, 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-[2px] border border-slate-200/50 shadow-inner">
                <div 
                  className="bg-el-blue h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min((stepIndex + 1) * 20, 100)}%` }} 
                />
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 mt-6 font-semibold uppercase tracking-widest flex items-center gap-1.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-el-blue animate-pulse" />
              Takes about 15-20 seconds
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .intake-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f0f4ff;
          color: #0d1b3e;
          font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .intake-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 10%, rgba(26, 58, 255, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 90%, rgba(26, 58, 255, 0.04) 0%, transparent 60%),
            #f0f4ff;
          pointer-events: none;
          z-index: 0;
        }

        .intake-header {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
        }

        .intake-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-mark {
          font-size: 20px;
          color: #1a3aff;;
        }

        .logo-text {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #0d1b3e;
        }

        .intake-progress-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-label {
          font-size: 12px;
          color: #94a3b8
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .progress-track {
          width: 120px;
          height: 3px;
          background:#e2e8f0
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1a3aff, #3b6bff);
          border-radius: 99px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .intake-main {
          flex: 1;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 24px 16px 32px;
          position: relative;
          z-index: 1;
        }

        .chat-container {
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .messages-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 24px;
          min-height: 50vh;
        }

        .message-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: fadeUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .message-row--user {
          flex-direction: row-reverse;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eff3ff;
          border: 1px solid #c7d2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #1a3aff;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .bubble {
          max-width: 82%;
          padding: 13px 16px;
          border-radius: 14px;
          font-size: 15px;
          line-height: 1.6;
        }

        .bubble--assistant {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0d1b3e;
          border-radius: 4px 14px 14px 14px;
        }

        .bubble--user {
          background: linear-gradient(135deg, #1a3aff, #2040e0);
          color: #fff;
          border-radius: 14px 4px 14px 14px;
          border: none;
        }

        .bubble--typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 18px;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1a3aff;
          animation: bounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        .input-area {
          position: sticky;
          bottom: 0;
          padding-top: 16px;
          background: linear-gradient(to top, #f0f4ff 70%, transparent);
        }

        .input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 12px 12px 16px;
          transition: border-color 0.2s;
        }

        .input-wrap:focus-within {
          border-color: #1a3aff;
          box-shadow: 0 0 0 3px rgba(26, 58, 255, 0.08);
        }

        .chat-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          resize: none;
          color: #0d1b3e;
          font-size: 15px;
          line-height: 1.5;
          font-family: inherit;
          max-height: 120px;
          min-height: 24px;
        }

        .chat-input::placeholder {
          color: #94a3b8;
        }

        .chat-input:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .send-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1a3aff, #2040e0);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .input-hint {
          margin-top: 8px;
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f0f4ff] text-[#0d1b3e]">
        <div className="text-sm">Loading intake...</div>
      </div>
    }>
      <IntakeContent />
    </Suspense>
  );
}