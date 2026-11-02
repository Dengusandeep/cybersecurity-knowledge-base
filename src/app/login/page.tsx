"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, LogIn, KeyRound, ArrowLeft, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const urlMessage = searchParams.get("message");
  const isForgotRequested =
    searchParams.get("view") === "forgot" ||
    searchParams.get("mode") === "forgot" ||
    searchParams.get("forgot") === "true";

  const [view, setView] = useState<"login" | "forgot">(isForgotRequested ? "forgot" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetMessage("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetMessage("Check your email for the reset link");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
          {view === "forgot" ? (
            <KeyRound className="h-7 w-7 text-accent-light" />
          ) : (
            <Shield className="h-7 w-7 text-accent-light" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          {view === "forgot" ? "Reset Password" : "Admin Login"}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {view === "forgot"
            ? "Enter your email to receive a password reset link"
            : "Sign in to manage your content"}
        </p>
      </div>

      {view === "forgot" ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
              placeholder="admin@example.com"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {resetMessage && (
            <p className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
              {resetMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            <Send className="h-4 w-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setView("login");
                setError("");
                setResetMessage("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-light transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                Password
              </label>
              <Link
                href="/forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setView("forgot");
                  setError("");
                  setResetMessage("");
                }}
                className="text-xs font-medium text-accent hover:text-accent-light transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {urlMessage && !error && (
            <p className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
              {urlMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            <LogIn className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Suspense fallback={<div className="text-center text-sm text-text-muted">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
