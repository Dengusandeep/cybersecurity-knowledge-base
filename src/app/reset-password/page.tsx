"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Eye, EyeOff, ShieldAlert, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    // Listen for PASSWORD_RECOVERY event with onAuthStateChange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!isMounted) return;
      if (event === "PASSWORD_RECOVERY") {
        setStatus("valid");
      }
    });

    async function handleAuth() {
      try {
        // Check for error in query string
        const urlError = searchParams.get("error");
        const urlErrorCode = searchParams.get("error_code");
        if (urlError || urlErrorCode) {
          if (isMounted) setStatus("invalid");
          return;
        }

        // Support URL hash (#access_token=... or #error=...)
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash) {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
          if (hashParams.get("error") || hashParams.get("error_code")) {
            if (isMounted) setStatus("invalid");
            return;
          }

          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token") || "";
          if (accessToken) {
            try {
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (!sessionError && isMounted) {
                setStatus("valid");
                return;
              }
            } catch {
              // If setSession fails, proceed to check getSession()
            }
          }
        }

        // Support ?code= in query string (exchange it with supabase.auth.exchangeCodeForSession)
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (isMounted) setStatus("invalid");
            return;
          }

          if (isMounted) {
            setStatus("valid");
            return;
          }
        }

        // Check if session is already active (e.g. established via auth callback or client auto-detect)
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) setStatus("valid");
          return;
        }

        // Wait a brief moment to allow supabase auto-detect or PASSWORD_RECOVERY event to fire
        const timer = setTimeout(async () => {
          if (!isMounted) return;
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          if (currentSession) {
            setStatus("valid");
          } else {
            setStatus("invalid");
          }
        }, 800);

        return () => clearTimeout(timer);
      } catch {
        if (isMounted) setStatus("invalid");
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 animate-pulse">
            <KeyRound className="h-7 w-7 text-accent-light" />
          </div>
          <p className="text-sm text-text-muted">Verifying recovery link...</p>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Reset Link Expired</h1>
            <p className="mt-2 text-sm text-text-muted">
              This reset link has expired. Request a new one
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
            <KeyRound className="h-7 w-7 text-accent-light" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Set New Password</h1>
          <p className="mt-1 text-sm text-text-muted">Enter your new password below</p>
        </div>

        {success ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-1 font-semibold text-text-primary">Password updated</h3>
            <p className="text-xs text-text-muted">Redirecting to login in 2 seconds...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-secondary">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-text-secondary">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Password"}
              <KeyRound className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 animate-pulse">
              <KeyRound className="h-7 w-7 text-accent-light" />
            </div>
            <p className="text-sm text-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
