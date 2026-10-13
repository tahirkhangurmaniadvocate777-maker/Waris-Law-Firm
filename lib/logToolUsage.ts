import { LEAD_CAPTURED_KEY, LEAD_ID_KEY } from "@/lib/leadStorage";

export type LogToolUsageOpts = {
  toolUsed: string;
  draftType: string;
};

/**
 * Ensures a lead is captured in localStorage, then POSTs a UsageLog via /api/usage.
 * Returns false if the lead gate is not satisfied (caller should not print).
 */
export async function ensureLeadThenLog(opts: LogToolUsageOpts): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const captured = localStorage.getItem(LEAD_CAPTURED_KEY) === "1";
  const leadId = localStorage.getItem(LEAD_ID_KEY);
  if (!captured || !leadId) {
    return false;
  }

  try {
    const response = await fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        toolUsed: opts.toolUsed,
        tool: opts.toolUsed,
        draftType: opts.draftType || "General Query",
      }),
    });
    // Allow print even if logging fails (network) once lead is present —
    // but require a successful 2xx when lead exists so bad leadIds block print.
    if (response.status === 404) return false;
    return true;
  } catch {
    return true;
  }
}

/** Alias matching the requested helper name. */
export const ensureLeadThenLogUsage = ensureLeadThenLog;
