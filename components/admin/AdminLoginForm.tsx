"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({
  redirectTo = "/admin",
  dark = false,
}: {
  redirectTo?: string;
  dark?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error || "Login failed.");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        dark
          ? "rounded-lg bg-slate-900 p-5"
          : "rounded-lg border border-line bg-white p-5"
      }
    >
      <label
        className={`block text-sm font-medium ${dark ? "text-amber-100" : "text-navy"}`}
      >
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={
            dark
              ? "mt-1.5 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              : "mt-1.5 w-full rounded border border-line px-3 py-2 text-sm"
          }
        />
      </label>
      {error ? (
        <p className={`mt-3 text-sm ${dark ? "text-red-300" : "text-red-700"}`}>{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={
          dark
            ? "mt-4 w-full rounded bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
            : "mt-4 w-full rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        }
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
