/**
 * Builds Waris-Law-Firm-Documentation.pdf from the complete plan + coding inventory.
 * Usage: node scripts/export-docs-pdf.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const FILE_ROLES = {
  "app/layout.tsx": "Root layout, fonts, global chrome",
  "app/page.tsx": "Home / brand hero",
  "app/about/page.tsx": "Advocate / firm about page",
  "app/contact/page.tsx": "Contact page + inquiry form + map",
  "app/practice-areas/page.tsx": "Practice areas index",
  "app/practice-areas/[slug]/page.tsx": "Practice area detail by slug",
  "app/tools/page.tsx": "Tools hub",
  "app/tools/layout.tsx": "Tools layout (portal shell)",
  "app/tools/criminal-trial-referencer/page.tsx": "Criminal Trial Referencer tool page",
  "app/tools/criminal-applications-writer/page.tsx": "Criminal Applications Writer tool page",
  "app/tools/civil-suit-writer/page.tsx": "Civil Suit Writer tool page",
  "app/tools/family-suit-writer/page.tsx": "Family Suit Writer tool page",
  "app/tools/revenue-applications-writer/page.tsx": "Revenue Applications Writer tool page",
  "app/tools/fbr-secp-practice/page.tsx": "FBR / SECP practice hub page",
  "app/tools/fbr-secp-hub/page.tsx": "FBR / SECP hub alias page",
  "app/tools/case-prep/page.tsx": "Case preparation console page",
  "app/admin/page.tsx": "Admin dashboard (leads, usage, referencer)",
  "app/admin/login/page.tsx": "Admin login page",
  "app/admin/actions.ts": "Admin server actions",
  "app/actions/admin.ts": "Shared admin actions",
  "app/api/leads/route.ts": "POST lead capture API",
  "app/api/leads/capture/route.ts": "Alternate lead capture endpoint",
  "app/api/usage/route.ts": "POST tool usage logging",
  "app/api/referencer/route.ts": "Public referencer search/read API",
  "app/api/admin/login/route.ts": "Admin password login",
  "app/api/admin/logout/route.ts": "Admin session logout",
  "app/api/admin/referencer/route.ts": "Referencer CRUD (admin)",
  "app/api/case-prep/analyze/route.ts": "Case-prep analysis API",
  "app/api/v1/writer/generate/route.ts": "Criminal draft → .docx / JSON",
  "app/api/v1/automate/civil/route.ts": "Civil automation API",
  "app/api/v1/automate/extended-criminal/route.ts": "Extended criminal automation API",
  "app/api/v1/vault/upload-evidence/route.ts": "Evidence upload vault API",
  "components/DraftingPortalShell.tsx": "Sidebar portal around tools",
  "components/PortalSearch.tsx": "Portal law-field search UI",
  "components/LeadGate.tsx": "Gate before first tool use",
  "components/LeadProvider.tsx": "Lead context provider",
  "components/CriminalApplicationsWriter.tsx": "Criminal writer UI + preview + generate",
  "components/CriminalModuleForm.tsx": "Per-module criminal form fields",
  "components/CriminalReferencer.tsx": "Referencer UI",
  "components/CivilSuitWriter.tsx": "Civil plaint writer UI",
  "components/FamilySuitWriter.tsx": "Family suit writer UI",
  "components/FamilyDynamicForm.tsx": "Dynamic family form from schema",
  "components/FamilyAnnexureBLoop.tsx": "Dowry Annexure-B item rows",
  "components/MaintenanceSuitWriter.tsx": "Maintenance-only family writer",
  "components/RevenueApplicationsWriter.tsx": "Revenue applications writer UI",
  "components/RevenuePartitionForm.tsx": "Agri partition form",
  "components/RevenuePartitionCanvasForm.tsx": "Partition canvas / Naksha UI",
  "components/FbrSecpHub.tsx": "FBR / SECP checklists + links",
  "components/CasePreparationConsole.tsx": "Case prep console UI",
  "components/CourtPleadingPreview.tsx": "Court-style HTML petition preview",
  "components/PetitionPreview.tsx": "Generic petition preview",
  "components/TextPetition.tsx": "Text petition renderer",
  "components/TemporaryInjunctionForm.tsx": "Temporary injunction form (O39)",
  "components/OfficeMap.tsx": "Chambers Google Maps embed",
  "components/ContactForm.tsx": "Public contact inquiry form",
  "components/SiteChrome.tsx": "Site shell wrapper",
  "components/SiteHeader.tsx": "Public site header/nav",
  "components/SiteFooter.tsx": "Public site footer",
  "components/admin/AdminDashboard.tsx": "Admin dashboard UI",
  "components/admin/AdminLoginForm.tsx": "Admin login form",
  "components/AdminDashboardClient.tsx": "Admin dashboard client wrapper",
  "lib/firm.ts": "Firm contact / office location config",
  "lib/firmCounsel.ts": "Counsel name defaults",
  "lib/auth.ts": "Admin session cookie HMAC auth",
  "lib/db.ts": "Prisma client singleton",
  "lib/criminal.ts": "Criminal draft builders (25 modules)",
  "lib/criminalModuleFields.ts": "Criminal module field metadata",
  "lib/criminal-docx.ts": "Criminal .docx generation",
  "lib/criminalPrecedents.ts": "Criminal precedent notes",
  "lib/civil.ts": "Civil plaint builders",
  "lib/civil-docx.ts": "Civil .docx helpers",
  "lib/civilOptions.ts": "Civil suit type options",
  "lib/civilPrecedents.ts": "Civil precedent notes",
  "lib/family.ts": "Family suit template fill",
  "lib/familyPleading.ts": "Family pleading assembly",
  "lib/config/familyFormSchema.ts": "Family form schema",
  "lib/maintenance.ts": "Maintenance-only suit logic",
  "lib/revenue.ts": "Revenue application builders",
  "lib/revenuePartition.ts": "Agricultural partition logic",
  "lib/revenueCitations.ts": "Revenue law citations",
  "lib/config/taxGuides.ts": "FBR / SECP guide content",
  "lib/config/websiteContent.ts": "Marketing site copy",
  "lib/config/automationRegistry.ts": "Automation module registry",
  "lib/portalSearchCatalog.ts": "Portal search index data",
  "lib/practice.ts": "Practice area definitions",
  "lib/writerClient.ts": "Client helper for writer API",
  "lib/writerFormMap.ts": "Form → API field mapping",
  "lib/types/drafting.ts": "Shared drafting TypeScript types",
  "lib/leadStorage.ts": "Client lead storage helpers",
  "lib/logToolUsage.ts": "Client usage logging helper",
  "lib/logUsageServer.ts": "Server usage log writer",
  "lib/casePrepPrecedents.ts": "Case-prep precedent data",
  "lib/caseLawCitations.ts": "Case-law citation helpers",
  "lib/format.ts": "Date / text formatting helpers",
  "lib/ui.tsx": "Shared UI primitives",
  "lib/storage.ts": "Local/storage helpers",
  "lib/legalUpload.ts": "Legal upload types/helpers",
  "lib/legalUploadEngine.ts": "Evidence upload engine",
  "lib/extendedCriminalFormData.ts": "Extended criminal form data",
  "prisma/schema.prisma": "DB schema (leads, usage, referencer)",
  "prisma/seed.ts": "Seed referencer / demo data",
  "scripts/generate-criminal-docx.mjs": "Seed/generate criminal .docx templates",
  "scripts/generate-civil-docx.mjs": "Seed/generate civil .docx templates",
  "scripts/generate-extended-criminal-docx.mjs": "Extended criminal .docx generator",
  "scripts/rename-type-ids.mjs": "Module type-id rename utility",
  "scripts/export-docs-pdf.mjs": "This documentation PDF exporter",
};

function walk(dir, exts) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, exts));
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function rel(p) {
  return path.relative(root, p).split(path.sep).join("/");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inCode = false;
  let inTable = false;
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html += "</ul>\n";
      listOpen = false;
    }
  };
  const closeTable = () => {
    if (inTable) {
      html += "</tbody></table>\n";
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      closeList();
      closeTable();
      if (!inCode) {
        inCode = true;
        html += "<pre><code>";
      } else {
        inCode = false;
        html += "</code></pre>\n";
      }
      continue;
    }
    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      continue;
    }

    if (/^\|/.test(line)) {
      closeList();
      if (/^\|\s*-+/.test(line)) continue;
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        html += "<table><thead><tr>";
        cells.forEach((c) => {
          html += `<th>${inlineMd(c)}</th>`;
        });
        html += "</tr></thead><tbody>\n";
      } else {
        html += "<tr>";
        cells.forEach((c) => {
          html += `<td>${inlineMd(c)}</td>`;
        });
        html += "</tr>\n";
      }
      continue;
    }
    closeTable();

    if (/^[-*] /.test(line)) {
      if (!listOpen) {
        listOpen = true;
        html += "<ul>\n";
      }
      html += `<li>${inlineMd(line.slice(2))}</li>\n`;
      continue;
    }
    closeList();

    if (/^### /.test(line)) {
      html += `<h3>${inlineMd(line.slice(4))}</h3>\n`;
      continue;
    }
    if (/^## /.test(line)) {
      html += `<h2>${inlineMd(line.slice(3))}</h2>\n`;
      continue;
    }
    if (/^# /.test(line)) {
      html += `<h1>${inlineMd(line.slice(2))}</h1>\n`;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      html += "<hr/>\n";
      continue;
    }
    if (!line.trim()) {
      html += "<br/>\n";
      continue;
    }
    html += `<p>${inlineMd(line)}</p>\n`;
  }
  closeList();
  closeTable();
  if (inCode) html += "</code></pre>\n";
  return html;
}

function inlineMd(text) {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:[^)]+)\)/g,
    '<a href="$2">$1</a>'
  );
  return s;
}

function codingSectionHtml() {
  const sourceExts = new Set([".ts", ".tsx", ".js", ".mjs", ".prisma"]);
  const templateExts = new Set([".txt", ".md", ".docx"]);
  const sources = [
    ...walk(path.join(root, "app"), sourceExts),
    ...walk(path.join(root, "components"), sourceExts),
    ...walk(path.join(root, "lib"), sourceExts),
    ...walk(path.join(root, "prisma"), sourceExts),
    ...walk(path.join(root, "scripts"), sourceExts),
  ]
    .map(rel)
    .sort();

  const templates = walk(path.join(root, "templates"), templateExts)
    .map(rel)
    .sort();

  const byFolder = (prefix) =>
    sources.filter((f) => f.startsWith(prefix));

  const groups = [
    ["App routes & pages (`app/`)", byFolder("app/")],
    ["React components (`components/`)", byFolder("components/")],
    ["Libraries & config (`lib/`)", byFolder("lib/")],
    ["Database (`prisma/`)", byFolder("prisma/")],
    ["Scripts (`scripts/`)", byFolder("scripts/")],
  ];

  let html = `
  <h1>PART B — Coding Files Reference</h1>
  <p>Inventory of application source files (excluding <code>node_modules</code> and <code>.next</code>) and on-disk pleading templates. Generated ${new Date().toISOString().slice(0, 10)}.</p>
  <p><strong>Counts:</strong> ${sources.length} source files · ${templates.length} template files</p>
  <h2>Architecture map (code → feature)</h2>
  <table>
    <thead><tr><th>Feature</th><th>Primary pages</th><th>Primary UI</th><th>Primary libs</th></tr></thead>
    <tbody>
      <tr><td>Marketing site</td><td><code>app/page.tsx</code>, about, contact, practice-areas</td><td>SiteHeader/Footer/Chrome, ContactForm, OfficeMap</td><td><code>lib/firm.ts</code>, <code>lib/config/websiteContent.ts</code>, <code>lib/practice.ts</code></td></tr>
      <tr><td>Tools hub / portal</td><td><code>app/tools/*</code></td><td>DraftingPortalShell, PortalSearch, LeadGate</td><td><code>lib/portalSearchCatalog.ts</code></td></tr>
      <tr><td>Criminal referencer</td><td><code>app/tools/criminal-trial-referencer</code></td><td>CriminalReferencer</td><td>Prisma + admin referencer API</td></tr>
      <tr><td>Criminal writer (25)</td><td><code>app/tools/criminal-applications-writer</code></td><td>CriminalApplicationsWriter, CriminalModuleForm</td><td><code>lib/criminal.ts</code>, <code>criminal-docx.ts</code>, writer API</td></tr>
      <tr><td>Civil writer</td><td><code>app/tools/civil-suit-writer</code></td><td>CivilSuitWriter, TemporaryInjunctionForm</td><td><code>lib/civil.ts</code>, <code>civil-docx.ts</code></td></tr>
      <tr><td>Family writer</td><td><code>app/tools/family-suit-writer</code></td><td>FamilySuitWriter, FamilyDynamicForm, Annexure-B</td><td><code>lib/family.ts</code>, <code>maintenance.ts</code></td></tr>
      <tr><td>Revenue writer</td><td><code>app/tools/revenue-applications-writer</code></td><td>RevenueApplicationsWriter, Partition forms</td><td><code>lib/revenue.ts</code>, <code>revenuePartition.ts</code></td></tr>
      <tr><td>FBR / SECP hub</td><td><code>app/tools/fbr-secp-*</code></td><td>FbrSecpHub</td><td><code>lib/config/taxGuides.ts</code></td></tr>
      <tr><td>Admin</td><td><code>app/admin/*</code></td><td>AdminDashboard, AdminLoginForm</td><td><code>lib/auth.ts</code>, <code>lib/db.ts</code></td></tr>
      <tr><td>Leads & usage</td><td>API routes under <code>app/api/leads</code>, <code>usage</code></td><td>LeadGate / LeadProvider</td><td><code>lib/leadStorage.ts</code>, log helpers</td></tr>
    </tbody>
  </table>
  `;

  for (const [title, files] of groups) {
    html += `<h2>${escapeHtml(title)}</h2>\n<table><thead><tr><th>File</th><th>Role</th></tr></thead><tbody>\n`;
    for (const f of files) {
      const role = FILE_ROLES[f] || "Application source";
      html += `<tr><td><code>${escapeHtml(f)}</code></td><td>${escapeHtml(role)}</td></tr>\n`;
    }
    html += "</tbody></table>\n";
  }

  html += `<h2>Templates on disk (<code>templates/</code>)</h2>
  <p>Plain-text and Word templates used by drafting modules.</p>
  <ul class="compact">\n`;
  for (const t of templates) {
    html += `<li><code>${escapeHtml(t)}</code></li>\n`;
  }
  html += `</ul>
  <h2>Config & entry points</h2>
  <table><thead><tr><th>File</th><th>Role</th></tr></thead><tbody>
  <tr><td><code>package.json</code></td><td>Scripts: <code>dev</code>, <code>build</code>, <code>start</code>, db seed, docx generators</td></tr>
  <tr><td><code>next.config.ts</code></td><td>Next.js configuration</td></tr>
  <tr><td><code>tsconfig.json</code></td><td>TypeScript configuration</td></tr>
  <tr><td><code>WARIS-LAW-FIRM-COMPLETE-PLAN.md</code></td><td>Master plan (source for Part A)</td></tr>
  <tr><td><code>.env.example</code></td><td>Env template (do not commit secrets)</td></tr>
  </tbody></table>
  <p class="footer-note">End of Waris Law Firm Documentation (Plan + Coding Files)</p>
  `;
  return html;
}

const planPath = path.join(root, "WARIS-LAW-FIRM-COMPLETE-PLAN.md");
const planMd = fs.readFileSync(planPath, "utf8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Waris Law Firm — Plan &amp; Coding Documentation</title>
<style>
  @page { margin: 16mm 14mm; size: A4; }
  body {
    font-family: "Segoe UI", "Calibri", Georgia, serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #1a2332;
    max-width: 100%;
  }
  h1 {
    font-size: 18pt;
    color: #0b1f3a;
    border-bottom: 2px solid #0b1f3a;
    padding-bottom: 6px;
    page-break-before: always;
    margin-top: 0;
  }
  h1:first-of-type { page-break-before: avoid; }
  h2 {
    font-size: 13pt;
    color: #0b1f3a;
    margin-top: 1.4em;
    border-bottom: 1px solid #c5d0de;
    padding-bottom: 3px;
    page-break-after: avoid;
  }
  h3 { font-size: 11.5pt; color: #1e3a5f; page-break-after: avoid; }
  p { margin: 0.45em 0; }
  code {
    font-family: Consolas, "Courier New", monospace;
    font-size: 8.5pt;
    background: #f0f3f7;
    padding: 0 3px;
    border-radius: 2px;
  }
  pre {
    background: #f4f6f9;
    border: 1px solid #d5dde8;
    padding: 8px 10px;
    font-size: 8pt;
    overflow-x: auto;
    white-space: pre-wrap;
    page-break-inside: avoid;
  }
  pre code { background: none; padding: 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.7em 0 1em;
    font-size: 9pt;
    page-break-inside: auto;
  }
  th, td {
    border: 1px solid #c5d0de;
    padding: 4px 6px;
    vertical-align: top;
    text-align: left;
  }
  th { background: #0b1f3a; color: #fff; }
  tr:nth-child(even) td { background: #f7f9fc; }
  ul { margin: 0.4em 0 0.8em 1.2em; }
  ul.compact { columns: 2; column-gap: 18px; font-size: 8.5pt; }
  ul.compact li { break-inside: avoid; margin: 2px 0; }
  hr { border: none; border-top: 1px solid #c5d0de; margin: 1.2em 0; }
  a { color: #1e4d8c; text-decoration: none; }
  .cover {
    page-break-after: always;
    text-align: center;
    padding-top: 28vh;
  }
  .cover h1 {
    border: none;
    font-size: 26pt;
    page-break-before: avoid;
  }
  .cover .sub { font-size: 12pt; color: #44566e; margin-top: 0.6em; }
  .cover .meta { margin-top: 2em; font-size: 10pt; color: #334455; }
  .footer-note { margin-top: 2em; font-style: italic; color: #556677; }
</style>
</head>
<body>
  <section class="cover">
    <h1>Waris Law Firm</h1>
    <p class="sub">Complete Project Plan &amp; Coding Files Documentation</p>
    <p class="meta">
      Advocate Muhammad Tahir Khan Gurmani<br/>
      District Courts, Dera Ghazi Khan<br/>
      Document date: ${new Date().toISOString().slice(0, 10)}<br/>
      Sources: WARIS-LAW-FIRM-COMPLETE-PLAN.md + application source tree
    </p>
  </section>
  <section>
    <h1 style="page-break-before:avoid">PART A — Complete Project Plan</h1>
    ${mdToHtml(planMd.replace(/^# WARIS LAW FIRM[^\n]*\n/, "").replace(/^## Website[^\n]*\n/, ""))}
  </section>
  <section>
    ${codingSectionHtml()}
  </section>
</body>
</html>`;

const outHtml = path.join(root, "Waris-Law-Firm-Documentation.html");
const outPdf = path.join(root, "Waris-Law-Firm-Documentation.pdf");
fs.writeFileSync(outHtml, html, "utf8");

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const chrome = chromeCandidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("Chrome/Edge not found. HTML written to", outHtml);
  process.exit(1);
}

const fileUrl = `file:///${outHtml.replace(/\\/g, "/")}`;
const result = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outPdf}`,
    "--print-to-pdf-no-header",
    fileUrl,
  ],
  { encoding: "utf8" }
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || "Chrome print failed");
  console.error("HTML kept at", outHtml);
  process.exit(result.status || 1);
}

const stat = fs.statSync(outPdf);
console.log(`PDF written: ${outPdf} (${Math.round(stat.size / 1024)} KB)`);
console.log(`HTML written: ${outHtml}`);
