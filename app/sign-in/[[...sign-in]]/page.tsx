"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneVal, setPhoneVal] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isPending && session) {
      window.location.href = "/dashboard";
    }
  }, [session, isPending]);

  // Trigger login process
  const submitLogin = async (emailToUse: string, passwordToUse: string) => {
    setLoading(true);
    setError("");

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Authentication request timed out. Please verify that your internet connection is active."
            )
          ),
        10000
      )
    );

    try {
      const loginPromise = authClient.signIn.email({
        email: emailToUse,
        password: passwordToUse,
        rememberMe: false,
      });

      const { data, error: signInError } = (await Promise.race([loginPromise, timeoutPromise])) as any;

      if (signInError) {
        throw signInError;
      }

      // Delay ensures the auth cookie is fully written before navigation
      // Using window.location.href ensures a full reload and cookie transfer
      setTimeout(() => { window.location.href = "/dashboard"; }, 500);
      return;
    } catch (signInErr: any) {
      // If user not found, attempt Auto-Signup in test instance
      const msg = signInErr.message || "Invalid credentials.";
      const isUserNotFound = msg.toLowerCase().includes("user not found") || 
                             msg.includes("CREDENTIALS_SIGN_IN_FAILED") || 
                             msg.includes("INVALID_EMAIL_OR_PASSWORD");

      if (isUserNotFound) {
        try {
          const signUpPromise = authClient.signUp.email({
            email: emailToUse,
            password: passwordToUse,
            name: emailToUse.split("@")[0],
            
          });
          const { data: signUpData, error: signUpError } = (await Promise.race([signUpPromise, timeoutPromise])) as any;

          if (signUpError) {
            throw signUpError;
          }

          setTimeout(() => { window.location.href = "/dashboard"; }, 500);
          return;
        } catch (signUpErr: any) {
          setError(signUpErr.message || "Authentication failed.");
        }
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLogin(email, password);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setEmailError(false);
    setPhoneError(false);

    let hasError = false;
    if (!email.endsWith("@gmail.com")) {
      setEmailError(true);
      hasError = true;
    }
    if (phoneVal.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      setPhoneError(true);
      hasError = true;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: countryCode + phoneVal,
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccessMessage("Password reset successfully! You can now sign in.");
      setIsResettingPassword(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setPassword("");
    setPhoneVal("");
    setError("");
    setTimeout(() => { window.location.href = "/dashboard"; }, 500);

    let hasError = false;

    if (!email.endsWith("@gmail.com")) {
      setEmailError(true);
      hasError = true;
    }
    if (phoneVal.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      setPhoneError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: countryCode + phoneVal,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setName("");
      setEmail("");
      setPassword("");
      setPhoneVal("");
      setError("");
      setTimeout(() => { window.location.href = "/dashboard"; }, 500);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden px-4 py-8 pt-20 sm:pt-8 animate-fade-in"
      style={{
        backgroundImage: "radial-gradient(#e2e8f0 1.2px, transparent 1.2px)",
        backgroundSize: "24px 24px"
      }}
    >
      {/* Top Header Logo */}
      <div className="absolute top-6 left-6 z-20">
        <BrandLogo href="/" />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center relative w-full max-w-7xl mx-auto">
        
        {/* Left Floating Card: PRD Intake Flow (Hidden on mobile) */}
        <div className="hidden lg:block absolute left-4 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl p-5 select-none transform -rotate-6 -translate-y-16 hover:rotate-0 hover:translate-y-0 transition-all duration-300 z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
              INTAKE CHATFLOW
            </span>
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm mb-2">AI Product Assistant</h3>
          <div className="space-y-2 text-[11px] text-slate-500 font-medium leading-relaxed">
            <p>
              <strong className="text-slate-700">AI:</strong> What is the primary problem this SaaS solves?
            </p>
            <p>
              <strong className="text-slate-700">User:</strong> Freelancers lose track of tax-deductible receipts and expense logs...
            </p>
            <p>
              <strong className="text-slate-700">AI:</strong> Let's define the target user persona...
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
            <span>Session 04-B3</span>
            <span>Generating...</span>
          </div>
        </div>

        {/* Central Sign-in Card */}
        <div className="w-full max-w-[460px] bg-white rounded-3xl border border-slate-150 shadow-2xl p-8 sm:p-10 z-20 mx-auto relative animate-fade-in">
          {!isPending && session ? (
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-slate-500 text-sm font-semibold">Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {isResettingPassword 
                ? "Reset your password" 
                : activeTab === "signin" 
                ? "Sign in to PRD Generator" 
                : "Create your account"}
            </h1>
            <p className="text-slate-400 text-xs mt-2 font-medium">
              {isResettingPassword
                ? "Verify your registered phone number to set a new password."
                : activeTab === "signin" 
                ? "Welcome back. Enter your credentials to continue." 
                : "Register to get 2 Pro + 5 Free trial sessions."}
            </p>
          </div>

          {/* Tabs Toggle */}
          {!isResettingPassword && (
            <div className="flex bg-slate-100/80 p-1 rounded-xl mb-6 border border-slate-100 shadow-inner">
              <button
                type="button"
                onClick={() => { setActiveTab("signin"); setError(""); setSuccessMessage(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "signin"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-855"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("register"); setError(""); setSuccessMessage(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "register"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-855"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50/50 border border-emerald-100 text-emerald-600 text-xs rounded-xl font-semibold flex items-start gap-2 animate-fade-in">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-semibold flex items-start gap-2 animate-shake">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isResettingPassword ? (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className={`w-4 h-4 ${emailError ? "text-red-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                    }}
                    placeholder="smith@gmail.com"
                    className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm font-semibold transition-all outline-none ${
                      emailError
                        ? "bg-red-50/50 border-red-300 text-red-900 placeholder-red-300 focus:bg-red-50/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1.5 animate-shake">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse" />
                    Enter valid email address
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-full bg-slate-50/50 border border-slate-200 rounded-xl pl-3 pr-8 text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                      style={{ minWidth: "90px" }}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className={`w-4 h-4 ${phoneError ? "text-red-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      value={phoneVal}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, "");
                        setPhoneVal(cleaned);
                        setPhoneError(false);
                      }}
                      placeholder={countryCode === "+1" ? "201 555-0123" : "98765 43210"}
                      className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm font-semibold transition-all outline-none ${
                        phoneError
                          ? "bg-red-50/50 border-red-300 text-red-900 placeholder-red-300 focus:bg-red-50/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                          : "bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                      }`}
                    />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1.5 animate-shake">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse" />
                    Please enter a valid 10-digit phone number
                  </p>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  type="button"
                  onClick={() => { setIsResettingPassword(false); setError(""); setSuccessMessage(""); }}
                  className="text-slate-500 hover:text-slate-800 font-bold transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>

              {/* Reset Password Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/10 disabled:opacity-50 flex items-center justify-center gap-2 group text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={activeTab === "signin" ? handleFormSubmit : handleRegisterSubmit} className="space-y-5" noValidate>
              {activeTab === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className={`w-4 h-4 ${emailError ? "text-red-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                    }}
                    placeholder="smith@gmail.com"
                    autoComplete="off"
                    className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm font-semibold transition-all outline-none ${
                      emailError
                        ? "bg-red-50/50 border-red-300 text-red-900 placeholder-red-300 focus:bg-red-50/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1.5 animate-shake">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse" />
                    Enter valid email address
                  </p>
                )}
              </div>

              {/* Phone Field */}

              {activeTab === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative flex-shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-full bg-slate-50/50 border border-slate-200 rounded-xl pl-3 pr-8 text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                        style={{ minWidth: "90px" }}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                      </select>
                      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className={`w-4 h-4 ${phoneError ? "text-red-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        value={phoneVal}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D/g, "");
                          setPhoneVal(cleaned);
                          setPhoneError(false);
                        }}
                        placeholder={countryCode === "+1" ? "201 555-0123" : "98765 43210"}
                        className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm font-semibold transition-all outline-none ${
                          phoneError
                            ? "bg-red-50/50 border-red-300 text-red-900 placeholder-red-300 focus:bg-red-50/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            : "bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                        }`}
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-[11px] font-bold mt-1.5 flex items-center gap-1.5 animate-shake">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse" />
                      Please enter a valid 10-digit phone number
                    </p>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {activeTab === "signin" && (
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setIsResettingPassword(true); setError(""); setSuccessMessage(""); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/10 disabled:opacity-50 flex items-center justify-center gap-2 group text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {activeTab === "signin"
                        ? "Sign In to Dashboard"
                        : "Register Account"}
                    </span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
          )}
            </>
          )}
        </div>

        {/* Right Floating Card: AI PRD Builder (Hidden on mobile) */}
        <div className="hidden lg:block absolute right-4 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl p-5 select-none transform rotate-6 translate-y-16 hover:rotate-0 hover:translate-y-0 transition-all duration-300 z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
              AI PRD BUILDER
            </span>
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm mb-2">Document Output Mappings</h3>
          <div className="space-y-1 text-[11px] font-medium leading-relaxed">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">Executive Summary</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">95% Acc.</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">User Stories & AC</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">92% Acc.</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">Functional Reqs</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">90% Acc.</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
            <span>Export Ready</span>
            <span className="text-emerald-600 font-bold">PDF & Notion</span>
          </div>
        </div>

      </div>

    </div>
  );
}