"use client";

/**
 * Compatibility wrapper — tools are gated by LeadProvider in app/tools/layout.tsx.
 * Pages may keep wrapping with LeadGate; it no longer shows a second modal.
 * Accepts both legacy (source/matterType) and new (toolName/subType) prop names.
 */
export function LeadGate({
  children,
  toolName,
  subType,
  source,
  matterType,
}: {
  children: React.ReactNode;
  /** Preferred: tool id for usage / analytics (e.g. civil-suit-writer). */
  toolName?: string;
  /** Preferred: draft / suit subtype id. */
  subType?: string;
  /** Legacy alias for toolName. */
  source?: string;
  /** Legacy alias for subType / matter label. */
  matterType?: string;
}) {
  // Props retained for call-site compatibility; LeadProvider owns the gate UI.
  void toolName;
  void subType;
  void source;
  void matterType;
  return <>{children}</>;
}
