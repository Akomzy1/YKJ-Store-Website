"use client";

// ─── Contact Page — /contact ──────────────────────────────────────────────────
// Two-column layout: contact form (left) + contact info + map (right).

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Static contact data ──────────────────────────────────────────────────────
// Update with real details once confirmed with client.

const CONTACT = {
  address:   "123 High Street, London, E1 6BH, United Kingdom",
  phone:     "+44 20 0000 0000",
  email:     "hello@ykjfoodstore.co.uk",
  whatsapp:  "https://wa.me/442000000000",
  hours: [
    { days: "Monday – Friday", time: "9:00 am – 6:00 pm" },
    { days: "Saturday",        time: "9:00 am – 5:00 pm" },
    { days: "Sunday",          time: "10:00 am – 3:00 pm" },
  ],
  social: {
    instagram: "https://instagram.com/ykjfoodstore",
    facebook:  "https://facebook.com/ykjfoodstore",
  },
};

const SUBJECTS = [
  "Order enquiry",
  "Product availability",
  "Delivery issue",
  "Returns & refunds",
  "Wholesale / trade",
  "Partnership",
  "General question",
  "Other",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // In production this would POST to /api/contact (Resend email).
    // For now we simulate a short delay then show success.
    await new Promise((r) => setTimeout(r, 800));

    setSent(true);
    setLoading(false);
  }

  return (
    <main className="bg-[#FAFAF8]">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
            Get in touch
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Have a question, an order issue, or just want to say hello? We&apos;d
            love to hear from you. Our team typically responds within one
            business day.
          </p>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Contact form (3/5 width) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>

              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                    Message received!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Thanks for reaching out, {name.split(" ")[0]}. We&apos;ll be
                    in touch at <strong>{email}</strong> within one business
                    day.
                  </p>
                  <button
                    className="mt-6 text-sm text-[#A0522D] hover:underline font-medium"
                    onClick={() => {
                      setSent(false);
                      setName(""); setEmail(""); setSubject(""); setMessage("");
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="name">Full name</Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1"
                          placeholder="e.g. Amara Johnson"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
                      >
                        <option value="" disabled>
                          Select a subject…
                        </option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        placeholder="Tell us how we can help…"
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
                        "Send message"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* ── Contact info (2/5 width) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-5">
                Contact information
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-[#A0522D] shrink-0 mt-0.5" />
                  <span className="text-gray-600">{CONTACT.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-[#A0522D] shrink-0" />
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="text-gray-600 hover:text-[#A0522D]"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-[#A0522D] shrink-0" />
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-gray-600 hover:text-[#A0522D]"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 font-medium"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>

              {/* Business hours */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-[#A0522D]" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Business hours
                  </h3>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {CONTACT.hours.map(({ days, time }) => (
                    <li key={days} className="flex justify-between gap-4">
                      <span className="text-gray-500">{days}</span>
                      <span className="font-medium text-gray-800 text-right">
                        {time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social links */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                  Follow us
                </p>
                <div className="flex gap-3">
                  <a
                    href={CONTACT.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-[#A0522D]/10 flex items-center justify-center text-gray-600 hover:text-[#A0522D] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-[#A0522D]/10 flex items-center justify-center text-gray-600 hover:text-[#A0522D] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {/* Real Google Maps iframe goes here once address is confirmed */}
                <div className="text-center px-4">
                  <MapPin className="h-8 w-8 text-[#A0522D] mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    Map will appear once store address is confirmed
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-[#A0522D] hover:underline"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
              <div className="px-4 py-3 text-xs text-gray-500 text-center border-t border-gray-100">
                {CONTACT.address}
              </div>
            </div>

            {/* FAQ link */}
            <div className="bg-[#A0522D]/5 rounded-2xl border border-[#A0522D]/10 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Looking for quick answers?
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Check our FAQ for instant help.
                </p>
              </div>
              <Link
                href="/faq"
                className="text-sm font-semibold text-[#A0522D] hover:underline shrink-0 ml-3"
              >
                View FAQ →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
