import { cookies } from "next/headers";
import { loginAdmin, logoutAdmin } from "@/app/actions/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listVaultFiles } from "@/lib/legalUpload";

export const dynamic = "force-dynamic";

function AdminLoginForm({ showError }: { showError?: boolean }) {
  return (
    <main className="min-h-[70vh] bg-slate-950 px-5 py-16 text-slate-100">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold tracking-[0.18em] text-amber-400/90 uppercase">
          Waris Law Firm
        </p>
        <h1 className="mt-2 font-serif text-3xl text-amber-50">Administration</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with the office admin password to review leads, usage, and referencer content.
        </p>
        <form
          action={loginAdmin}
          className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-xl shadow-black/40"
        >
          <label className="block text-sm font-medium text-amber-100">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </label>
          {showError ? (
            <p className="mt-3 text-sm text-red-300">Incorrect password.</p>
          ) : null}
          <button
            type="submit"
            className="mt-4 w-full rounded bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const jar = await cookies();
  const sessionToken = jar.get(SESSION_COOKIE_NAME)?.value;
  const authenticated = sessionToken === SESSION_COOKIE_VALUE;

  const params = searchParams ? await searchParams : undefined;

  if (!authenticated) {
    return <AdminLoginForm showError={params?.error === "1"} />;
  }

  const [leads, usage, entries, vaultFiles] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        _count: { select: { logs: true } },
      },
    }),
    prisma.usageLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 300,
      include: { lead: { select: { fullName: true, email: true } } },
    }),
    prisma.referencerEntry.findMany({
      orderBy: { updatedAt: "desc" },
    }),
    listVaultFiles(),
  ]);

  const serializedLeads = leads.map((lead) => ({
    id: lead.id,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    matterType: lead.matterType,
    createdAt: lead.createdAt.toISOString(),
    logCount: lead._count.logs,
  }));

  const serializedUsage = usage.map((log) => ({
    id: log.id,
    timestamp: log.timestamp.toISOString(),
    toolUsed: log.toolUsed,
    draftType: log.draftType,
    leadId: log.leadId,
    leadName: log.lead.fullName,
    leadEmail: log.lead.email,
  }));

  const serializedEntries = entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    category: entry.category,
    sectionNumber: entry.sectionNumber,
    keywords: entry.keywords,
    shortNote: entry.shortNote,
    relatedSections: entry.relatedSections,
    checklistJson: entry.checklistJson,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-400/90 uppercase">
              Waris Law Firm
            </p>
            <h1 className="mt-1 font-serif text-3xl text-amber-50">Administration</h1>
            <p className="mt-1 text-sm text-slate-400">
              Leads, tool usage, criminal trial referencer, and evidence vault.
            </p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-amber-100 hover:border-amber-500/50"
            >
              Sign out
            </button>
          </form>
        </div>
        <AdminDashboard
          leads={serializedLeads}
          usage={serializedUsage}
          entries={serializedEntries}
          vaultFiles={vaultFiles}
          dark
        />
      </div>
    </main>
  );
}
