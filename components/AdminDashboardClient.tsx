"use client";

import { FormEvent, Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";

export type AdminLeadLog = {
  id: string;
  toolUsed: string;
  draftType: string;
  timestamp: string;
};

export type AdminLead = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string | null;
  matterType: string | null;
  createdAt: string;
  logs: AdminLeadLog[];
};

export type AdminVaultFile = {
  filename: string;
  relativePath: string;
  size: number;
  modifiedAt: string;
};

export function AdminDashboardClient({
  leads,
  vaultFiles = [],
}: {
  leads: AdminLead[];
  vaultFiles?: AdminVaultFile[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"leads" | "vault">("leads");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [vaultMessage, setVaultMessage] = useState("");
  const [vaultBusy, setVaultBusy] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [firNumber, setFirNumber] = useState("");
  const [moduleKey, setModuleKey] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) => {
      const hay = [
        lead.fullName,
        lead.phone,
        lead.email,
        lead.city ?? "",
        lead.matterType ?? "",
        ...lead.logs.map((l) => `${l.toolUsed} ${l.draftType}`),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [leads, query]);

  const totalLeads = leads.length;
  const totalLogs = leads.reduce((n, l) => n + l.logs.length, 0);
  const toolsUsed = useMemo(() => {
    const set = new Set<string>();
    for (const lead of leads) {
      for (const log of lead.logs) set.add(log.toolUsed);
    }
    return set.size;
  }, [leads]);

  async function uploadEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVaultMessage("");
    setVaultBusy(true);
    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    if (caseTitle.trim()) data.set("case_title", caseTitle.trim());
    if (firNumber.trim()) data.set("fir_number", firNumber.trim());
    if (moduleKey.trim()) data.set("moduleKey", moduleKey.trim());

    try {
      const response = await fetch("/api/v1/vault/upload-evidence", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
        savedFilename?: string;
      };
      if (!response.ok || !payload.success) {
        setVaultMessage(payload.message || payload.error || "Upload failed.");
        return;
      }
      setVaultMessage(payload.message || `Saved ${payload.savedFilename || "file"}.`);
      formEl.reset();
      setCaseTitle("");
      setFirNumber("");
      setModuleKey("");
      router.refresh();
    } catch {
      setVaultMessage("Upload failed.");
    } finally {
      setVaultBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 text-slate-100">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-400/90 uppercase">
            Waris Law Firm
          </p>
          <h1 className="mt-1 font-serif text-3xl text-amber-50">Admin dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">
            Captured leads, drafting usage logs, and evidence vault.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="rounded border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-amber-100 hover:border-amber-500/60"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Total leads" value={totalLeads} />
        <MetricCard label="Usage logs" value={totalLogs} />
        <MetricCard label="Vault files" value={vaultFiles.length} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["leads", "Leads"],
            ["vault", "Vault"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              tab === id
                ? "bg-amber-500 text-slate-950"
                : "border border-slate-600 bg-slate-900 text-amber-100"
            }`}
          >
            {label}
            {id === "leads" ? ` (${toolsUsed} tools)` : ""}
          </button>
        ))}
      </div>

      {tab === "leads" ? (
        <>
          <div className="mt-6">
            <label className="block text-sm font-medium text-amber-100">
              Search leads
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, phone, email, tool, draft type…"
                className="mt-1.5 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80 shadow-lg shadow-black/30">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-700 bg-slate-950/80 text-xs uppercase tracking-wide text-amber-400/70">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Matter</th>
                  <th className="px-3 py-2">Logs</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-slate-500" colSpan={7}>
                      No matching leads.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => {
                    const open = expandedId === lead.id;
                    return (
                      <Fragment key={lead.id}>
                        <tr className="border-b border-slate-800">
                          <td className="px-3 py-2 whitespace-nowrap text-slate-400">
                            {new Date(lead.createdAt).toLocaleString()}
                          </td>
                          <td className="px-3 py-2 font-medium text-amber-50">{lead.fullName}</td>
                          <td className="px-3 py-2">{lead.phone}</td>
                          <td className="px-3 py-2">{lead.email}</td>
                          <td className="px-3 py-2">{lead.matterType || "—"}</td>
                          <td className="px-3 py-2">{lead.logs.length}</td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setExpandedId(open ? null : lead.id)}
                              className="text-xs font-semibold text-amber-400 underline"
                            >
                              {open ? "Hide logs" : "Show logs"}
                            </button>
                          </td>
                        </tr>
                        {open ? (
                          <tr className="border-b border-slate-800 bg-slate-950/60">
                            <td colSpan={7} className="px-3 py-3">
                              {lead.logs.length === 0 ? (
                                <p className="text-sm text-slate-500">No usage logs for this lead.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {lead.logs.map((log) => (
                                    <li
                                      key={log.id}
                                      className="flex flex-wrap items-baseline justify-between gap-2 rounded border border-slate-800 bg-slate-900 px-3 py-2"
                                    >
                                      <div>
                                        <span className="font-medium text-amber-100">
                                          {log.toolUsed}
                                        </span>
                                        <span className="mx-2 text-slate-600">·</span>
                                        <span className="text-slate-300">
                                          Draft type: {log.draftType || "—"}
                                        </span>
                                      </div>
                                      <span className="text-xs text-slate-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {tab === "vault" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={uploadEvidence}
            className="rounded-xl border border-slate-700 bg-slate-900/80 p-4"
          >
            <h2 className="font-serif text-lg text-amber-50">Upload evidence</h2>
            <p className="mt-1 text-xs text-slate-500">
              PDF, DOCX, JPG, or PNG · max 15MB · field name <code>evidence_file</code>
            </p>
            <div className="mt-4 grid gap-3">
              <label className="block text-sm">
                <span className="font-medium text-amber-100">Evidence file</span>
                <input
                  name="evidence_file"
                  type="file"
                  accept=".pdf,.docx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-amber-100">Case title (optional)</span>
                <input
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-amber-100">FIR number (optional)</span>
                <input
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  value={firNumber}
                  onChange={(e) => setFirNumber(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-amber-100">Module key (optional)</span>
                <input
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  value={moduleKey}
                  onChange={(e) => setModuleKey(e.target.value)}
                />
              </label>
            </div>
            {vaultMessage ? <p className="mt-3 text-sm text-amber-300">{vaultMessage}</p> : null}
            <button
              type="submit"
              disabled={vaultBusy}
              className="mt-4 rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {vaultBusy ? "Uploading…" : "Upload to vault"}
            </button>
          </form>

          <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-700 bg-slate-950/80 text-xs uppercase tracking-wide text-amber-400/70">
                <tr>
                  <th className="px-3 py-2">Filename</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Modified</th>
                </tr>
              </thead>
              <tbody>
                {vaultFiles.length === 0 ? (
                  <tr>
                    <td className="px-3 py-4 text-slate-500" colSpan={3}>
                      No files in the vault yet.
                    </td>
                  </tr>
                ) : (
                  vaultFiles.map((file) => (
                    <tr key={file.filename} className="border-b border-slate-800">
                      <td className="px-3 py-2 font-mono text-xs">{file.filename}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {(file.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(file.modifiedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-lg shadow-black/30">
      <p className="text-xs font-semibold tracking-wide text-amber-400/80 uppercase">{label}</p>
      <p className="mt-2 font-serif text-3xl text-amber-50">{value}</p>
    </div>
  );
}
