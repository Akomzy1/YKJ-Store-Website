"use client";

// ─── Register Page — /register ────────────────────────────────────────────────
// New account creation: full name, email, password, confirm password.
// Also offers Google OAuth sign-up.
// Uses createBrowserClient from @supabase/ssr for cookie-based sessions.

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Inner component ──────────────────────────────────────────────────────────

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/account";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Password strength indicator ──────────────────────────────────────────────

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (score === 3) return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  })();

  // ── Email / password registration ─────────────────────────────────────────────

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = getSupabase();

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          marketing_opt_in: marketingOptIn,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  // ── Google OAuth ─────────────────────────────────────────────────────────────

  async function handleGoogleSignUp() {
    setError(null);
    setGoogleLoading(true);

    const supabase = getSupabase();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  // ── Success state ─────────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              We&apos;ve sent a confirmation link to{" "}
              <strong className="text-gray-900">{email}</strong>. Click the
              link to activate your account.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Back to sign in
            </Button>
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
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Join the YKJ community today
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

          {/* Google button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-11 border-gray-300 hover:bg-gray-50"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="mx-4 text-xs text-gray-400 uppercase tracking-wide">
              or sign up with email
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Registration form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full name */}
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1"
                placeholder="e.g. Amara Johnson"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Strength bar */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pr-10 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-400 focus-visible:ring-red-400"
                      : ""
                  }`}
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Marketing opt-in */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="marketing"
                checked={marketingOptIn}
                onCheckedChange={(checked) =>
                  setMarketingOptIn(checked === true)
                }
                className="mt-0.5"
              />
              <Label
                htmlFor="marketing"
                className="text-sm font-normal text-gray-600 cursor-pointer"
              >
                Send me deals, new arrivals, and exclusive offers from YKJ
              </Label>
            </div>

            {/* T&C */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked === true)
                }
                className="mt-0.5"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal text-gray-600 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#A0522D] hover:underline"
                  target="_blank"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#A0522D] hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading || !agreedToTerms}
              className="w-full h-11 bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#A0522D] hover:text-[#7B3F1A]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
