"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "🚚 Free delivery on orders over £60",
  "🌍 Authentic African & Caribbean groceries",
  "📦 Fast UK-wide delivery",
  "✨ New arrivals every week",
];

const SESSION_KEY = "ykj-announcement-dismissed";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setDismissed(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setDismissed(true);
  };

  // Render a fixed-height placeholder while un-mounted to avoid layout shift
  if (!mounted) {
    return <div className="h-8 bg-brand-500" aria-hidden />;
  }

  if (dismissed) return null;

  return (
    <div className="bg-brand-500 text-white text-xs sm:text-sm relative overflow-hidden">
      {/* ── Mobile: CSS marquee ─────────────────────────────────────────── */}
      <div className="md:hidden overflow-hidden py-2 pr-10">
        {/*
          Messages duplicated so the animation is seamless:
          when the first copy exits left, the second copy takes its place,
          then the animation loops back to position 0.
        */}
        <p className="whitespace-nowrap animate-marquee inline-block">
          {[...MESSAGES, ...MESSAGES].map((msg, i) => (
            <span key={i} className="inline-flex items-center">
              {msg}
              <span className="mx-5 opacity-40 select-none" aria-hidden>
                ·
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* ── Desktop: static, centred, pipe-separated ────────────────────── */}
      <div className="hidden md:flex items-center justify-center py-2 pr-10">
        {MESSAGES.map((msg, i) => (
          <span key={msg} className="flex items-center">
            <span>{msg}</span>
            {i < MESSAGES.length - 1 && (
              <span className="mx-5 opacity-30 select-none" aria-hidden>
                |
              </span>
            )}
          </span>
        ))}
      </div>

      {/* ── Dismiss button ──────────────────────────────────────────────── */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement bar"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded"
      >
        <X size={13} />
      </button>
    </div>
  );
}
