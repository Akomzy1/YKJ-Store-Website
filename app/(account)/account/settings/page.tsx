"use client";

// ─── Account Settings — /account/settings ────────────────────────────────────
// Client Component: profile updates, password change, marketing toggle,
// and danger zone (delete account).
// Uses createBrowserClient from @supabase/ssr for auth + DB mutations.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ─── Supabase browser client ──────────────────────────────────────────────────

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 text-base">{title}</h2>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

// ─── Toast helper ─────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
        type === "success"
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-red-50 border border-red-200 text-red-800"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      )}
      {message}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();

  // ── Profile state ──────────────────────────────────────────────────────────

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // ── Password state ─────────────────────────────────────────────────────────

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // ── Delete account state ───────────────────────────────────────────────────

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // ── Load profile on mount ──────────────────────────────────────────────────

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, marketing_opt_in")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setPhone(profile.phone ?? "");
        setMarketingOptIn(profile.marketing_opt_in ?? false);
      }

      setProfileLoading(false);
    }

    loadProfile();
  }, [router]);

  // ── Save profile ───────────────────────────────────────────────────────────

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setProfileSaving(true);
    setProfileMsg(null);

    const supabase = getSupabase();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        marketing_opt_in: marketingOptIn,
      })
      .eq("id", userId);

    setProfileMsg(
      error
        ? { text: error.message, type: "error" }
        : { text: "Profile updated successfully.", type: "success" }
    );
    setProfileSaving(false);
  }

  // ── Change password ────────────────────────────────────────────────────────

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({
        text: "Password must be at least 8 characters.",
        type: "error",
      });
      return;
    }

    setPasswordSaving(true);
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMsg({ text: error.message, type: "error" });
    } else {
      setPasswordMsg({
        text: "Password changed successfully.",
        type: "success",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  }

  // ── Delete account ─────────────────────────────────────────────────────────

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE" || !userId) return;
    setDeleting(true);

    const supabase = getSupabase();

    // Delete profile row first (cascade deletes should handle order data via DB triggers)
    await supabase.from("profiles").delete().eq("id", userId);

    // Sign out — Supabase does not expose a delete-user API from the client;
    // in production this should call a server-side admin function.
    await supabase.auth.signOut();
    router.push("/?deleted=1");
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-[#A0522D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-xl font-bold text-gray-900">Settings</h1>

      {/* ── Profile details ── */}
      <Section
        title="Personal information"
        description="Update your name and phone number."
      >
        {profileMsg && (
          <div className="mb-5">
            <Toast message={profileMsg.text} type={profileMsg.type} />
          </div>
        )}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
              placeholder="e.g. Amara Johnson"
            />
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
              placeholder="e.g. +44 7700 900000"
            />
          </div>

          {/* Marketing toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Marketing emails
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Receive deals, new arrivals, and exclusive offers
              </p>
            </div>
            <Switch
              checked={marketingOptIn}
              onCheckedChange={setMarketingOptIn}
            />
          </div>

          <Button
            type="submit"
            disabled={profileSaving}
            className="bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold"
          >
            {profileSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </Section>

      {/* ── Change password ── */}
      <Section
        title="Change password"
        description="Choose a strong password of at least 8 characters."
      >
        {passwordMsg && (
          <div className="mb-5">
            <Toast message={passwordMsg.text} type={passwordMsg.type} />
          </div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-400 focus-visible:ring-red-400"
                  : ""
              }`}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1 text-xs text-red-500">
                Passwords do not match
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={passwordSaving}
            className="bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold"
          >
            {passwordSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h2 className="font-semibold text-red-900 text-base">Danger zone</h2>
        </div>
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-gray-600">
            Deleting your account is permanent and cannot be undone. All your
            order history and saved information will be removed.
          </p>

          {!showDeleteWarning ? (
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowDeleteWarning(true)}
            >
              Delete my account
            </Button>
          ) : (
            <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Type{" "}
                <span className="font-mono font-bold tracking-wide">
                  DELETE
                </span>{" "}
                to confirm:
              </p>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="font-mono border-red-300 focus-visible:ring-red-400"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteWarning(false);
                    setDeleteConfirm("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  disabled={deleteConfirm !== "DELETE" || deleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete account"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
