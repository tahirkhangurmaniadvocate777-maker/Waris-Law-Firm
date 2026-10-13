"use client";

import { FormEvent, useState } from "react";
import { firm } from "@/lib/firm";

const inputClass =
  "mt-1.5 w-full border border-line bg-mist px-3 py-2.5 text-sm outline-none transition focus:border-brass focus:bg-white";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setPending(true);
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(data.get("fullName") ?? data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          city: String(data.get("city") ?? ""),
          matterType: String(data.get("matterType") ?? ""),
          toolUsed: "contact",
          draftType: "inquiry",
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not send this inquiry.");
      event.currentTarget.reset();
      setMessage("The office has your inquiry.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send this inquiry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-line bg-white p-6 md:p-8">
      <p className="font-serif text-2xl text-navy">Send an inquiry</p>
      <label className="text-sm font-medium text-navy">
        Full name
        <input name="fullName" required minLength={2} className={inputClass} />
      </label>
      <label className="text-sm font-medium text-navy">
        Phone
        <input name="phone" required inputMode="tel" className={inputClass} />
      </label>
      <label className="text-sm font-medium text-navy">
        Email
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className="text-sm font-medium text-navy">
        City <span className="font-normal text-ink/45">(optional)</span>
        <input name="city" className={inputClass} />
      </label>
      <label className="text-sm font-medium text-navy">
        Matter
        <select name="matterType" className={inputClass} defaultValue="">
          <option value="" disabled>
            Select practice area
          </option>
          {firm.practice.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-navy">{message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send to the office"}
      </button>
    </form>
  );
}
