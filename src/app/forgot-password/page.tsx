"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Send, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
            <KeyRound className="h-7 w-7 text-accent-light" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Reset Password</h1>
          <p className="mt-1 text-sm text-text-muted">Enter your email to receive a recovery link</p>
        </div>

        {success ? (
          <div className="rounded-lg border border-border bg-bg-secondary p-6 text-center shadow-sm">
            <p className="mb-4 text-sm font-semibold text-green-400">
              Check your email for the reset link
            </p>
            <p className="mb-6 text-xs text-text-muted">
              We&apos;ve sent a password recovery link to <strong>{email}</strong>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
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

            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Recovery Link"}
              <Send className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-light transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
