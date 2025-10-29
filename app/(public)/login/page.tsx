"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = supabaseBrowser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    setLoading(false);
    if (error) alert(error.message);
    else setSent(true);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#f2f0ed] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-[#2e2e2e]">Sign in</h1>
        <p className="text-sm text-black/60 mt-1">
          We’ll email you a login link. No password needed.
        </p>

        {sent ? (
          <div className="mt-6 text-sm text-green-700">
            Check your inbox for the magic link ✉️
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border p-3"
            />
            <button
              disabled={loading}
              className="w-full rounded-xl bg-[#d96857] text-white py-3 font-medium hover:opacity-90"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-xs text-black/60">
          Return to{" "}
          <Link href="/" className="underline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
