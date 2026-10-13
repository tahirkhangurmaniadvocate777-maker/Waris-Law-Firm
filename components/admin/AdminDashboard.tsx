"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { inputClass } from "@/lib/ui";

type Lead = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  city: string | null;
  matterType: string | null;
  logCount?: number;
};

type Usage = {
  id: string;
  timestamp: string;
  toolUsed: string;
  draftType: string;
  leadId: string;
  leadName?: string;
  leadEmail?: string;
};

type Entry = {
  id: string;
  title: string;
  category: string;
  sectionNumber: string | null;
  keywords: string;
  shortNote: string;
  relatedSections: string | null;
  checklistJson: string;
  createdAt?: string;
  updatedAt: string;
};

const emptyEntry = {
  title: "",
  category: "trial stage",
  sectionNumber: "",
  keywords: "",
  shortNote: "",
  relatedSections: "",
  checklistJson: "",
};

type VaultFile = {
  filename: string;
  relativePath: string;
  size: number;
  modifiedAt: string;
};

function checklistDisplay(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.join(" | ");
  } catch {
    /* keep raw */
  }
  return raw;
}

export function AdminDashboard({
  leads,
  usage,
  entries,
  vaultFiles,
  dark = false,
}: {
  leads: Lead[];
  usage: Usage[];
  entries: Entry[];
  vaultFiles: VaultFile[];
  dark?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"leads" | "usage" | "referencer" | "vault">("leads");
  const [form, setForm] = useState(emptyEntry);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [vaultMessage, setVaultMessage] = useState("");
  const [vaultBusy, setVaultBusy] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [firNumber, setFirNumber] = useState("");
  const [moduleKey, setModuleKey] = useState("");

  const sortedLeads = useMemo(() => leads, [leads]);

  const panel = dark
    ? "overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80"
    : "overflow-x-auto rounded-lg border border-line bg-white";
  const thead = dark
    ? "border-b border-slate-700 bg-slate-950/80 text-xs uppercase tracking-wide text-amber-400/70"
    : "border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-ink/60";
  const rowBorder = dark ? "border-b border-slate-800" : "border-b border-line/70";
  const tabActive = dark ? "bg-amber-500 text-slate-950" : "bg-navy text-white";
  const tabIdle = dark
    ? "border border-slate-600 bg-slate-900 text-amber-100"
    : "border border-line bg-white text-navy";
  const formPanel = dark
    ? "rounded-xl border border-slate-700 bg-slate-900/80 p-4"
    : "rounded-lg border border-line bg-white p-4";
  const labelText = dark ? "font-medium text-amber-100" : "font-medium text-navy";
  const fieldClass = dark
    ? "mt-1 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
    : `mt-1 ${inputClass}`;

  async function saveEntry(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/referencer", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { id: editId, ...form } : form),
    });
    if (!response.ok) {
      setMessage("Could not save entry.");
      return;
    }
    setForm(emptyEntry);
    setEditId(null);
    setMessage("Saved.");
    router.refresh();
  }

  async function removeEntry(id: string) {
    if (!confirm("Delete this referencer entry?")) return;
    await fetch(`/api/admin/referencer?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    router.refresh();
  }

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
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["leads", "Leads"],
            ["usage", "Usage"],
            ["referencer", "Referencer"],
            ["vault", "Vault"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded px-3 py-1.5 text-sm font-medium ${tab === id ? tabActive : tabIdle}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "leads" ? (
        <div className={`mt-6 ${panel}`}>
          <table className="min-w-full text-left text-sm">
            <thead className={thead}>
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">Matter</th>
                <th className="px-3 py-2">Logs</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={7}>
                    No leads yet.
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => (
                  <tr key={lead.id} className={rowBorder}>
                    <td
                      className={`px-3 py-2 whitespace-nowrap ${dark ? "text-slate-400" : "text-ink/60"}`}
                    >
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                    <td className={`px-3 py-2 font-medium ${dark ? "text-amber-50" : "text-navy"}`}>
                      {lead.fullName}
                    </td>
                    <td className="px-3 py-2">{lead.phone}</td>
                    <td className="px-3 py-2">{lead.email || "—"}</td>
                    <td className="px-3 py-2">{lead.city || "—"}</td>
                    <td className="px-3 py-2">{lead.matterType || "—"}</td>
                    <td className="px-3 py-2">{lead.logCount ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "usage" ? (
        <div className={`mt-6 ${panel}`}>
          <table className="min-w-full text-left text-sm">
            <thead className={thead}>
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Tool</th>
                <th className="px-3 py-2">Draft type</th>
                <th className="px-3 py-2">Lead</th>
              </tr>
            </thead>
            <tbody>
              {usage.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={4}>
                    No usage logs yet.
                  </td>
                </tr>
              ) : (
                usage.map((row) => (
                  <tr key={row.id} className={rowBorder}>
                    <td
                      className={`px-3 py-2 whitespace-nowrap ${dark ? "text-slate-400" : "text-ink/60"}`}
                    >
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className={`px-3 py-2 ${dark ? "text-amber-50" : "text-navy"}`}>
                      {row.toolUsed}
                    </td>
                    <td className="px-3 py-2">{row.draftType || "—"}</td>
                    <td className="px-3 py-2">
                      <span className="block">{row.leadName || "—"}</span>
                      <span
                        className={`block font-mono text-xs ${dark ? "text-slate-500" : "text-ink/50"}`}
                      >
                        {row.leadEmail || row.leadId.slice(0, 8)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "referencer" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <form onSubmit={saveEntry} className={formPanel}>
            <h2 className={`font-serif text-lg ${dark ? "text-amber-50" : "text-navy"}`}>
              {editId ? "Edit entry" : "Add entry"}
            </h2>
            <div className="mt-4 grid gap-3">
              {(
                [
                  ["title", "Title"],
                  ["category", "Category"],
                  ["sectionNumber", "Section"],
                  ["keywords", "Keywords"],
                  ["shortNote", "Short note"],
                  ["checklistJson", "Checklist (use | between steps, or JSON array)"],
                  ["relatedSections", "Related sections"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-sm">
                  <span className={labelText}>{label}</span>
                  {key === "shortNote" || key === "checklistJson" ? (
                    <textarea
                      rows={key === "checklistJson" ? 2 : 3}
                      className={fieldClass}
                      value={form[key]}
                      onChange={(e) => setForm((c) => ({ ...c, [key]: e.target.value }))}
                      required={key === "shortNote"}
                    />
                  ) : (
                    <input
                      className={fieldClass}
                      value={form[key]}
                      onChange={(e) => setForm((c) => ({ ...c, [key]: e.target.value }))}
                      required={key === "title" || key === "category"}
                    />
                  )}
                </label>
              ))}
            </div>
            {message ? (
              <p className={`mt-3 text-sm ${dark ? "text-amber-300" : "text-navy-2"}`}>{message}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="submit"
                className={
                  dark
                    ? "rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950"
                    : "rounded bg-navy px-4 py-2 text-sm font-semibold text-white"
                }
              >
                {editId ? "Update" : "Create"}
              </button>
              {editId ? (
                <button
                  type="button"
                  className={
                    dark
                      ? "rounded border border-slate-600 px-4 py-2 text-sm text-slate-200"
                      : "rounded border border-line px-4 py-2 text-sm"
                  }
                  onClick={() => {
                    setEditId(null);
                    setForm(emptyEntry);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className={formPanel}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p
                      className={`text-xs uppercase tracking-wide ${dark ? "text-amber-400" : "text-gold"}`}
                    >
                      {entry.category}
                    </p>
                    <h3 className={`font-serif text-lg ${dark ? "text-amber-50" : "text-navy"}`}>
                      {entry.title}
                    </h3>
                    {entry.sectionNumber ? (
                      <p className={`text-sm ${dark ? "text-slate-400" : "text-ink/70"}`}>
                        {entry.sectionNumber}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`text-sm font-medium underline ${dark ? "text-amber-300" : "text-navy-2"}`}
                      onClick={() => {
                        setEditId(entry.id);
                        setForm({
                          title: entry.title,
                          category: entry.category,
                          sectionNumber: entry.sectionNumber ?? "",
                          keywords: entry.keywords,
                          shortNote: entry.shortNote,
                          relatedSections: entry.relatedSections ?? "",
                          checklistJson: checklistDisplay(entry.checklistJson),
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-red-400 underline"
                      onClick={() => removeEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className={`mt-2 text-sm leading-6 ${dark ? "text-slate-300" : "text-ink/80"}`}>
                  {entry.shortNote}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "vault" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <form onSubmit={uploadEvidence} className={formPanel}>
            <h2 className={`font-serif text-lg ${dark ? "text-amber-50" : "text-navy"}`}>
              Upload evidence
            </h2>
            <p className={`mt-1 text-xs ${dark ? "text-slate-500" : "text-ink/60"}`}>
              PDF, DOCX, JPG, or PNG · max 15MB · field name <code>evidence_file</code>
            </p>
            <div className="mt-4 grid gap-3">
              <label className="block text-sm">
                <span className={labelText}>Evidence file</span>
                <input
                  name="evidence_file"
                  type="file"
                  accept=".pdf,.docx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className={fieldClass}
                  required
                />
              </label>
              <label className="block text-sm">
                <span className={labelText}>Case title (optional)</span>
                <input
                  className={fieldClass}
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className={labelText}>FIR number (optional)</span>
                <input
                  className={fieldClass}
                  value={firNumber}
                  onChange={(e) => setFirNumber(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className={labelText}>Module key (optional)</span>
                <input
                  className={fieldClass}
                  value={moduleKey}
                  onChange={(e) => setModuleKey(e.target.value)}
                />
              </label>
            </div>
            {vaultMessage ? (
              <p className={`mt-3 text-sm ${dark ? "text-amber-300" : "text-navy-2"}`}>
                {vaultMessage}
              </p>
            ) : null}
            <div className="mt-4">
              <button
                type="submit"
                disabled={vaultBusy}
                className={
                  dark
                    ? "rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
                    : "rounded bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                }
              >
                {vaultBusy ? "Uploading…" : "Upload to vault"}
              </button>
            </div>
          </form>

          <div className={panel}>
            <table className="min-w-full text-left text-sm">
              <thead className={thead}>
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
                    <tr key={file.filename} className={rowBorder}>
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
