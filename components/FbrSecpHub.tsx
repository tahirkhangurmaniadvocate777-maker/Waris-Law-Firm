"use client";

import { useState } from "react";
import {
  REGULATORY_REGISTRY,
  REGULATORY_SECURITY_DISCLAIMER,
  RESEARCH_PORTAL_LINKS,
  TAX_GUIDES_DISCLAIMER,
  type RegulatoryRegistryId,
} from "@/lib/config/taxGuides";
import { ensureLeadThenLog } from "@/lib/logToolUsage";

const GUIDE_ORDER: RegulatoryRegistryId[] = ["fbr_iris", "secp_ezfile", "partnership_aop"];

export function FbrSecpHub() {
  const [activeTab, setActiveTab] = useState<RegulatoryRegistryId>("fbr_iris");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const currentGuide = REGULATORY_REGISTRY[activeTab];

  const handleToggleTask = (taskName: string) => {
    const key = `${activeTab}_${taskName}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 p-6 text-slate-100 selection:bg-amber-500/20 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-slate-900 pb-6">
          <div className="mb-3 inline-block rounded bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
            Tool 6 — FBR / SECP Practice Hub
          </div>
          <h1 className="font-serif text-3xl font-medium text-white">
            Regulatory Advisory &amp; Compliance Guides
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Access secure pre-filing document checklists and verified links for corporate
            registration and tax portals.
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">{TAX_GUIDES_DISCLAIMER}</p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-2">
          {GUIDE_ORDER.map((id) => {
            const guide = REGULATORY_REGISTRY[id];
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`rounded px-4 py-2 text-xs font-semibold tracking-wider uppercase transition ${
                  active
                    ? "bg-amber-500 text-slate-950 shadow-lg"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {guide.tabLabel}
              </button>
            );
          })}
        </div>

        <div className="space-y-6 rounded-xl border border-slate-900 bg-slate-900/40 p-6 shadow-2xl">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-xl font-medium text-white">{currentGuide.title}</h2>
              <span className="mt-1 block font-mono text-[10px] tracking-wide text-slate-500 uppercase">
                Governing Framework: {currentGuide.lawContext}
              </span>
            </div>

            <a
              href={currentGuide.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                void ensureLeadThenLog({
                  toolUsed: "fbr-secp-practice",
                  draftType: `portal-${currentGuide.id}`,
                })
              }
              className="flex shrink-0 items-center justify-center gap-1.5 rounded border border-slate-800 bg-slate-950 px-4 py-2 text-center text-xs font-semibold tracking-wider text-amber-400 uppercase transition hover:bg-slate-900"
            >
              Launch {currentGuide.portalName} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Mandatory Prerequisite Checklist
            </span>
            <div className="space-y-2">
              {currentGuide.checklist.map((task) => {
                const isChecked = !!completedTasks[`${activeTab}_${task.name}`];
                return (
                  <button
                    key={task.name}
                    type="button"
                    onClick={() => handleToggleTask(task.name)}
                    className={`flex w-full cursor-pointer items-start gap-4 rounded-lg border p-4 text-left transition select-none ${
                      isChecked
                        ? "border-amber-500/30 bg-slate-900/80 opacity-70"
                        : "border-slate-900 bg-slate-950 hover:border-slate-800"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition ${
                        isChecked
                          ? "border-amber-500 bg-amber-500 font-bold text-slate-950"
                          : "border-slate-700 bg-slate-900"
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked ? "✓" : null}
                    </span>
                    <span className="space-y-0.5">
                      <span
                        className={`block text-xs font-semibold ${
                          isChecked ? "text-slate-400 line-through" : "text-white"
                        }`}
                      >
                        {task.name}
                      </span>
                      <span className="block text-xs leading-relaxed text-slate-400">
                        {task.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
            <span className="mb-3 block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Research links
            </span>
            <ul className="flex flex-wrap gap-2">
              {RESEARCH_PORTAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded border border-slate-800 px-3 py-1.5 text-xs text-amber-400/90 transition hover:border-amber-500/40 hover:text-amber-300"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-900 bg-slate-950 p-4 text-justify font-sans text-[10px] leading-relaxed text-slate-500">
            <span className="mb-1 block font-bold tracking-wider text-slate-400 uppercase">
              Data Security &amp; Privacy Compliance Disclaimer
            </span>
            {REGULATORY_SECURITY_DISCLAIMER}
          </div>
        </div>
      </div>
    </div>
  );
}
