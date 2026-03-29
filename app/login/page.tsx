"use client";

import { useState } from "react";
import { login, signup } from "@/app/auth/actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = mode === "login" ? await login(formData) : await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F7F5F0]">
      {/* Logo / wordmark */}
      <div className="mb-10 text-center">
        <h1
          className="text-5xl text-[#1A1A2E]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          lingua
        </h1>
        <p className="mt-2 text-[#6B6B80] text-sm tracking-wide">
          learn any language, naturally
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>

        <form action={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-[#4A4A5A] mb-1">
                Your name
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Sofia"
                className="w-full rounded-xl border border-[#E4E2DD] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#B0AFBB] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#4A4A5A] mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#E4E2DD] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#B0AFBB] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A5A] mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#E4E2DD] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#B0AFBB] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3 text-sm hover:bg-[#5A52E0] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "Just a moment…" : mode === "login" ? "Sign in" : "Get started"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#6B6B80]">
          {mode === "login" ? "New to Lingua? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="text-[#6C63FF] font-medium hover:underline"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
