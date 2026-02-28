"use client";

// ─── Forgot Password Page — /forgot-password ──────────────────────────────────
// Sends a password-reset email via Supabase.
// Uses createBrowserClient from @supabase/ssr.
// Inner component reads useSearchParams; outer wraps in <Suspense>.

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Inner component ──────────────────────────────────────────────────────────

function ForgotPasswordForm() {
  useSearchParams(); // consumed to satisfy Suspense boundary requirement

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabase();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/settings`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  // ── Success state ─────────────────────────────────────────────────────────────

  if (sent) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Reset link sent
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              We&apos;ve emailed a password-reset link to{" "}
              <strong className="text-gray-900">{email}</strong>.
            </p>
            <p className="text-gray-500 text-xs mb-8">
              If you don&apos;t see it within a few minutes, check your spam
              folder.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/">
          <Image
            src="/assets/ykj-logo.jpg"
            alt="YKJ African & Caribbean Food Store"
            width={80}
            height={80}
            className="mx-auto rounded-full object-cover"
          />
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10">

          {/* Error banner */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
