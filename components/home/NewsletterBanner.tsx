"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterBanner() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError]   = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setStatus("loading");

    try {
      // TODO: POST /api/newsletter — integrate Resend in Phase 2
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="bg-brand-500 py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 mb-5">
            <Mail size={24} className="text-white" aria-hidden />
          </div>

          {/* Heading */}
          <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-3">
            Get Weekly Deals &amp; Fresh Arrivals in Your Inbox
          </h2>

          {/* Subtext */}
          <p className="text-white/75 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Join thousands of happy customers. Be first to hear about new products,
            exclusive discounts, and authentic recipes — no spam, unsubscribe anytime.
          </p>

          {/* ── Success state ────────────────────────────────────────── */}
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={40} className="text-green-300" aria-hidden />
              <p className="text-white font-semibold text-lg">
                You&apos;re subscribed — welcome!
              </p>
              <p className="text-white/70 text-sm max-w-xs">
                Check your inbox for a welcome email with your first exclusive deal.
              </p>
            </div>
          ) : (
            /* ── Form ──────────────────────────────────────────────── */
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="your@email.com"
                  required
                  disabled={status === "loading"}
                  autoComplete="email"
                  className={[
                    "w-full px-4 py-3 rounded-lg bg-white/95 text-foreground placeholder:text-muted-foreground/70",
                    "text-sm focus:outline-none focus:ring-2 focus:ring-white/60",
                    "disabled:opacity-60 transition-all",
                    error ? "ring-2 ring-red-400" : "",
                  ].join(" ")}
                  aria-describedby={error ? "newsletter-error" : undefined}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 px-6 py-3 bg-white hover:bg-brand-50 active:bg-brand-100 text-brand-700 font-bold rounded-lg text-sm transition-colors disabled:opacity-60 shadow-md"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}

          {/* Inline error */}
          {error && (
            <p id="newsletter-error" role="alert" className="mt-2.5 text-red-300 text-xs">
              {error}
            </p>
          )}

          {/* Trust line */}
          {status !== "success" && (
            <p className="mt-4 text-white/50 text-xs flex items-center justify-center gap-1.5">
              <Mail size={11} aria-hidden />
              No spam. Unsubscribe anytime.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
