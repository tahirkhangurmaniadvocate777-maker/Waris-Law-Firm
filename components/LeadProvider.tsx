"use client";

import React, {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LEAD_CAPTURED_KEY, LEAD_ID_KEY } from "@/lib/leadStorage";

export { LEAD_CAPTURED_KEY, LEAD_ID_KEY };

interface LeadData {
  fullName: string;
  phone: string;
  email: string;
}

interface LeadContextType {
  isRegistered: boolean;
  leadId: string | null;
  registerLead: (data: LeadData) => Promise<boolean>;
}

const LeadContext = createContext<LeadContextType | null>(null);

export function useLead(): LeadContextType {
  const ctx = useContext(LeadContext);
  if (!ctx) {
    throw new Error("useLead must be used within LeadProvider");
  }
  return ctx;
}

export function useLeadOptional(): LeadContextType | null {
  return useContext(LeadContext);
}

type LeadProviderProps = {
  children: React.ReactNode;
  /** When true, show the capture modal until registered (tools routes). */
  gateTools?: boolean;
};

export function LeadProvider({ children, gateTools = false }: LeadProviderProps) {
  const [ready, setReady] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const captured = localStorage.getItem(LEAD_CAPTURED_KEY) === "1";
    const storedId = localStorage.getItem(LEAD_ID_KEY);
    setIsRegistered(captured);
    setLeadId(storedId);
    setReady(true);
  }, []);

  const registerLead = useCallback(async (data: LeadData) => {
    setError("");
    try {
      const response = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        }),
      });
      const body = (await response.json()) as {
        success?: boolean;
        leadId?: string;
        error?: string;
      };
      if (!response.ok || !body.success || !body.leadId) {
        setError(body.error || "Could not save these details.");
        return false;
      }
      localStorage.setItem(LEAD_CAPTURED_KEY, "1");
      localStorage.setItem(LEAD_ID_KEY, body.leadId);
      setIsRegistered(true);
      setLeadId(body.leadId);
      return true;
    } catch {
      setError("Could not save these details.");
      return false;
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    await registerLead({
      fullName: String(form.get("fullName") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
    });
    setPending(false);
  }

  const value = useMemo(
    () => ({ isRegistered, leadId, registerLead }),
    [isRegistered, leadId, registerLead],
  );

  const showModal = gateTools && ready && !isRegistered;

  return (
    <LeadContext.Provider value={value}>
      <div className={showModal ? "pointer-events-none blur-[1px]" : undefined}>{children}</div>
      {showModal ? (
        <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-navy/70 p-4 sm:items-center">
          <form
            onSubmit={onSubmit}
            className="pointer-events-auto w-full max-w-md rounded-lg border border-navy-2/40 bg-navy p-6 text-white shadow-2xl shadow-navy/40"
          >
            <p className="font-serif text-xl text-brass-soft">Before you continue</p>
            <p className="mt-2 text-sm leading-6 text-stone/85">
              Leave your name, phone, and email so the office has a record of who used this drafting
              tool. Nothing here is filed in court by the website.
            </p>
            <label className="mt-4 block text-sm font-medium text-stone">
              Full name
              <input
                name="fullName"
                required
                minLength={2}
                className="mt-1 w-full rounded border border-navy-2 bg-navy-2/80 px-3 py-2 text-white placeholder:text-stone/40 focus:border-brass focus:outline-none"
              />
            </label>
            <label className="mt-3 block text-sm font-medium text-stone">
              Phone
              <input
                name="phone"
                required
                inputMode="tel"
                className="mt-1 w-full rounded border border-navy-2 bg-navy-2/80 px-3 py-2 text-white placeholder:text-stone/40 focus:border-brass focus:outline-none"
              />
            </label>
            <label className="mt-3 block text-sm font-medium text-stone">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded border border-navy-2 bg-navy-2/80 px-3 py-2 text-white placeholder:text-stone/40 focus:border-brass focus:outline-none"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="mt-5 w-full rounded bg-brass px-4 py-2.5 text-sm font-semibold text-navy disabled:opacity-60"
            >
              {pending ? "Saving…" : "Continue to tools"}
            </button>
          </form>
        </div>
      ) : null}
    </LeadContext.Provider>
  );
}
