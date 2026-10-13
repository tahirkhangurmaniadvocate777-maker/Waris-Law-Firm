# WARIS LAW FIRM — COMPLETE PROJECT PLAN
## Website + Legal Automation Tools

**Document:** Single master plan (all modules) — refreshed to match **current implemented reality** (Oct 2026)  
**Advocate:** Muhammad Tahir Khan Gurmani, Advocate High Court  
**Firm:** Waris Law Office / Waris Law Firm  
**Office:** Office No. 40, Ground Floor, Quaid-E-Azam Block, District Courts, Dera Ghazi Khan  
**Phones:** 0334-7744739 | 0300-1652953  
**Emails:** [warislawofficedbadgk@gmail.com](mailto:warislawofficedbadgk@gmail.com) | [muhammadtahirkhangurmaniadvocatedbadgk@outlook.com](mailto:muhammadtahirkhangurmaniadvocatedbadgk@outlook.com) | [tahirkhangurmaniadvocate777@gmail.com](mailto:tahirkhangurmaniadvocate777@gmail.com)  
**Practice areas:** Criminal Law | Civil Law | Revenue Law | Family Law | FBR / Tax & Corporate | Writ Petition

---

## 0. Implementation status (current)

| Area | Status |
|---|---|
| Marketing site (Home, Practice Areas, About, Contact) | **Live in app** |
| Contact chambers map | **Implemented** (Google Maps embed + open-in-Maps link) |
| Tools hub + drafting portal shell | **Implemented** |
| Portal law-field search | **Implemented** (sidebar search across practice areas + tools) |
| Criminal Trial Referencer | **Implemented** (Prisma + admin CRUD) |
| Criminal Applications Writer | **25 modules** (live preview + `.docx` via API) |
| Civil / Family / Revenue writers | **Implemented** |
| Family templates on disk | **6 locked templates** (+ maintenance-only UI type) |
| FBR / SECP Practice Hub | **Implemented** (checklists + links) |
| Lead capture + usage logs | **Implemented** |
| Admin (`/admin`) | **Implemented** (session cookie) |
| Writer API | **`POST /api/v1/writer/generate`** (docx / json) |

This document is the saved complete plan for the firm website and drafting tools. It reflects what is built in the codebase, not only the original v1 sketch.

---

## 1. Goal

Public website for the firm plus freely usable drafting tools for **criminal, civil, family, and revenue** matters, plus an **FBR / SECP practice guide hub**.

- Anyone who visits or uses a tool: name, phone, email saved in **Administration**.
- Drafts: live HTML petition preview + **browser Print / Save as PDF**; criminal modules also download court-style **`.docx`**.
- Tax/corporate modules = checklists + official portal links only (no IRIS/eZfile login from this site).
- Disclaimer on all tools: assistance only; filing remains advocate/user responsibility.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 |
| Database | SQLite via Prisma (leads, usage logs, referencer content) |
| Admin | Password-protected `/admin` (HMAC session cookie `waris_admin_session`) |
| Criminal output | HTML preview + `docx` package → `.docx` download |
| Print | HTML petition preview + browser Print / Save as PDF |
| Docx seed script | `npm run generate:criminal-docx` → `scripts/generate-criminal-docx.mjs` |

### Admin password note

- Env var: `ADMIN_PASSWORD`
- **Default fallback if unset:** `waris-admin-2026` (see `lib/auth.ts`)
- Change via `.env` for production; do not commit real secrets.

---

## 3. Site map & routes

```
Home → Practice Areas | About | Contact | Tools Hub
Tools Hub → Drafting Portal (sidebar) →
  Criminal Trial Referencer
  Criminal Applications Writer (?type=…) → Preview + Generate .docx
  Civil Suit Writer → Printable draft
  Family Suit Writer (?type=…) → Printable draft (+ Annexure-B for dowry)
  Revenue Applications Writer → Printable draft
  FBR / SECP Practice Hub → Checklists + links
Public use → Lead capture → Admin database
```

| Route | Purpose |
|---|---|
| `/` | Brand-forward hero; CTAs Contact + Tools |
| `/practice-areas` | Criminal, Civil, Family, Revenue, FBR/Corporate, Writ |
| `/about` | Advocate profile (DG Khan / High Court) |
| `/contact` | Address, phones, emails, inquiry form, chambers map |
| `/tools` | Hub for all tools |
| `/tools/criminal-trial-referencer` | Searchable trial stages / sections / notes |
| `/tools/criminal-applications-writer` | Criminal applications (25 types via `?type=`) |
| `/tools/civil-suit-writer` | Civil plaints (Order VII) → print |
| `/tools/family-suit-writer` | Family Court suits → print |
| `/tools/revenue-applications-writer` | LRA applications + agri partition → print |
| `/tools/fbr-secp-practice` | IRIS / eZfile checklists + official links |
| `/admin` | Leads, usage logs, referencer CRUD |

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/leads` | POST | Lead capture |
| `/api/usage` | POST | Usage logging |
| `/api/admin/login` | POST | Admin password login |
| `/api/admin/logout` | POST | Clear admin session |
| `/api/admin/referencer` | * | Referencer content CRUD |
| `/api/v1/writer/generate` | POST | Criminal draft → `.docx` or JSON |

**Generate body (criminal):** `{ type: CriminalAppType, fields: {...}, format?: "docx" | "json" }`  
Returns attachment `.docx` (default) or JSON draft when `format: "json"`. Logs usage as `criminal-applications-writer` / `{type}:{format}`.

---

## 4. Drafting portal (UI)

Implemented as `DraftingPortalShell` around tools pages:

- **Portal search:** sidebar search bar (`PortalSearch` + `portalSearchCatalog`) across practice areas, criminal/family/civil/revenue modules, and FBR/SECP guides
- **Criminal primary nav:** FIR Direction (22-A/B), Bail (497/498), Superdari (516-A), Attendance exemption
- **Criminal more:** full remaining module list (491-552, NBW, appeals, ID parade, habeas, etc.)
- **Family primary:** Khula, Dower & maintenance, Dowry + Annexure-B, Custody, Restitution, Maintenance only
- **Other tools:** Referencer, Civil, Revenue, FBR/SECP
- Deep links use query `?type=` on criminal and family writers
- Module-specific forms via `criminalModuleMeta` + `CriminalModuleForm` / `PortalFormShell`
- Lead gate before first tool use (`LeadGate`)
- **Contact map:** `OfficeMap` embeds Quaid-E-Azam Block / District Courts pin (`firm.officeLocation`)

---

## 5. Lead / Administration

**Capture fields:** Full name, phone, email (+ optional city / matter type)  
**When:** Contact form + before first tool use  
**Log:** Timestamp, tool used, draft/application type  
**Access:** `/admin` only (password session; see §2)

---

## 6. Tool 1 — Criminal Trial Referencer

Searchable index with filters:

- Categories: trial stage, CrPC/PPC section, case law, checklist, timeline, citation
- Search: title, section number, keywords, notes
- Detail: short note, related sections, practical checklist
- Seed: investigation → challan → charge → evidence → 249-A / 265-K / judgment
- Admin can add / edit / delete entries (`/api/admin/referencer`)

---

## 7. Tool 2 — Criminal Applications Writer (25 modules)

**Flow:** Select type (`?type=` or dropdown) → lead fields (if needed) → module form → live preview → **Generate .docx** (`POST /api/v1/writer/generate`) and/or Print / PDF → usage log

**Offense law dropdown (where relevant):** PPC | EMO | AMLA | CNSA | Other

**Default grounds for 249-A / 265-K:**

1. Groundless charge at any stage of trial  
2. Lack of incriminating material on record  
3. Zero probability of ultimate conviction  

### 7.1 Full module list (`criminalAppOptions`)

| # | ID | Label |
|---|---|---|
| 1 | `497` | Bail application u/s 497 Cr.P.C. (post-arrest) |
| 2 | `498` | Application u/s 498 Cr.P.C. |
| 3 | `249A` | Application u/s 249-A Cr.P.C. |
| 4 | `265K` | Application u/s 265-K Cr.P.C. |
| 5 | `court-witness` | Summoning of witness as Court Witness |
| 6 | `491-552` | Application u/s 491 r/w 552 Cr.P.C. (recovery of minor detenue) |
| 7 | `22A-22B` | Application u/s 22-A & 22-B Cr.P.C. (direction to register FIR) |
| 8 | `516A` | Application u/s 516-A Cr.P.C. (release on Superdari) |
| 9 | `NBW` | Application for Non-Bailable Arrest Warrants (absconding accused) |
| 10 | `DISPENSE` | Application to dispense with personal attendance of accused |
| 11 | `216` | Application u/s 216 Cr.P.C. (alteration of charges) |
| 12 | `NONHARASS` | Application for direction not to harass / deter petitioner (Saiel) |
| 13 | `APPEAL` | Criminal Appeal against conviction |
| 14 | `REVISION` | Criminal Revision u/s 439 / 439-A Cr.P.C. |
| 15 | `200` | Private Complaint u/s 200 Cr.P.C. |
| 16 | `SUMMON200` | Application to summon accused (private complaint u/s 200) |
| 17 | `WITNESS-SUMMONS` | Application for summoning witnesses to record evidence |
| 18 | `MEDICAL-BOARD` | Application for constitution of Medical Board (re-examination) |
| 19 | `EXEMPT-ADJOURN` | Application for exemption from appearance and adjournment |
| 20 | `ID-PARADE` | Application for identification parade |
| 21 | `DISCHARGE-63` | Application for discharge of accused (s.63 / editable) |
| 22 | `HABEAS-491` | Habeas corpus / production of person u/s 491 Cr.P.C. |
| 23 | `WITNESS-RECALL-540` | Application for recall of witness u/s 540 Cr.P.C. |
| 24 | `E-EVIDENCE-164` | Application for recording / production of electronic evidence |
| 25 | `BAIL-CANCEL-497` | Application for cancellation of bail u/s 497 Cr.P.C. |

### 7.2 Six newer modules (ID-PARADE set)

Added after the core 13+ set:

1. **ID-PARADE** — identification parade  
2. **DISCHARGE-63** — discharge (editable section, default 63)  
3. **HABEAS-491** — habeas / production u/s 491  
4. **WITNESS-RECALL-540** — recall of witness u/s 540  
5. **E-EVIDENCE-164** — electronic evidence recording / production  
6. **BAIL-CANCEL-497** — cancellation of bail u/s 497  

### 7.3 Notable earlier expansions (beyond original 5)

- **22A-22B** — FIR registration direction (Justice of Peace)  
- **491-552** — minor recovery (+ affidavit)  
- **516A** — Superdari / property release  
- **NBW** — non-bailable warrants for absconding accused  
- Plus: DISPENSE, 216, NONHARASS, APPEAL, REVISION, 200, SUMMON200, WITNESS-SUMMONS, MEDICAL-BOARD, EXEMPT-ADJOURN  

### 7.4 Template / docx inventory (criminal)

Plain-text templates under `templates/criminal/` and Word sources under `templates/criminal/docx/` (and some dual-named `.docx` in the parent folder). Generation uses `lib/criminal-docx.ts` + live `buildCriminalDraft` in `lib/criminal.ts`.

Examples on disk:

```
templates/criminal/
  22a-22b-fir-direction.txt
  491-552-minor-recovery.txt
  516a-superdari.txt
  nbw-absconding-arrest.txt
  identification_parade.txt (+ .docx)
  accused_discharge_63.txt (+ .docx)
  habeas_corpus_491.txt (+ .docx)
  witness_recall_540 / electronic_evidence_164 / bail_cancellation_497 …
  docx/   ← paired .docx for each module (497, 498, 249a, 265k, 22a-22b, …)
```

---

## 8. Tool 3 — Civil Suit Writer (CPC 1908)

**Structural flow:**  
Plaint (Orders VI & VII) → Written Statement (Order VIII) → Issues & Trial (Order XIV)

**Every plaint includes (Order VII Rule 1):**

1. Heading & forum (Civil Judge Class I/II/III; Sec. 15–20 CPC)  
2. Title of parties  
3. Nature of suit  
4. Statement of facts (numbered paragraphs)  
5. Cause of action  
6. Jurisdiction clause  
7. Valuation & court-fee clause  
8. Prayer  
9. Verification + List of Documents + Address Form placeholders  

**Kinds of suits (dropdown):**

1. Declaratory suit — Sec. 42 Specific Relief Act 1877  
2. Permanent / mandatory injunction — Sec. 53–55 SRA  
3. Specific performance of contract — Sec. 12 SRA  
4. Possession & mesne profits — Sec. 8/9 SRA  
5. Cancellation of documents — Sec. 39 SRA  
6. Suit for damages / torts  
7. Urban / built-up partition — Partition Act 1893  
8. Other / custom title  

*(Agricultural partition = Revenue Tool)*

---

## 9. Tool 4 — Family Suit Writer

**Law:** Family Courts Act 1964 / Rules 1965  
**Extras:** Schedule of Witnesses & Documents; interim maintenance/custody option; reconciliation notes (Sec. 10 & 12)  
**Portal types:** khula | dower-maintenance | dowry | custody | restitution | **maintenance-only**

### Dropdown + template files

| # | Suit | Status | File |
|---|---|---|---|
| 1 | Dissolution / Khula | LOCKED | `templates/family/khula-dissolution.txt` |
| 2 | Dower (Mahr) & past/future maintenance | LOCKED | `templates/family/dower-maintenance-recovery.txt` |
| 3 | Dowry articles (Jahiz) & bridal gifts | LOCKED | `templates/family/dowry-articles-recovery.txt` |
| 3b | Annexure-B itemized list | LOCKED | `templates/family/dowry-annexure-b.txt` |
| 4 | Custody u/s 25 Guardians & Wards Act | LOCKED | `templates/family/custody-guardians-wards-s25.txt` |
| 5 | Restitution of conjugal rights | LOCKED | `templates/family/restitution-conjugal-rights.txt` |
| 6 | Maintenance only (UI writer) | Implemented | `lib/maintenance.ts` (+ Family/Maintenance writers) |

### Shared form fields (most family templates)

`court_location`, `plaintiff_name`, `plaintiff_relation`, `plaintiff_address`, `plaintiff_phone`,  
`defendant_name`, `defendant_relation`, `defendant_address`, `defendant_phone`,  
`lawyer_name` (default: Muhammad Tahir Khan Gurmani), `current_date`

### 9.1 Khula — extra fields

`marriage_date`, `children_count`, `children_details`, `abuse_description`,  
`abandonment_date`, `cause_of_action_date`  
**Prayer:** Decree for dissolution on basis of Khula

### 9.2 Dower & Maintenance — extra fields

`total_dower_amount`, `dower_type_e_g_prompt_or_deferred`,  
`dower_paid_status_e_g_nothing_has_been_paid_or_gold_is_pending`,  
`abandonment_date`, `maintenance_stopped_date`,  
`defendant_occupation`, `defendant_income`,  
`school_name`, `school_expense`,  
`past_maintenance_start_date`, `past_maintenance_end_date`, `requested_past_rate`,  
`requested_future_rate`,  
`dower_description_e_g_5_tolas_gold_or_cash_amount`,  
`total_past_amount`, `wife_future_rate`, `child_future_rate`  
**Prayer:** Outstanding Mahr + past maintenance + future maintenance (10% annual increase)

### 9.3 Dowry Articles — extra fields

`bari_gold_weight`, `abandonment_date`, `total_dowry_value`, `cause_of_action_date`  
**Print:** Main plaint + Annexure-B together

### 9.4 Annexure-B rows

| Row | Description | Value |
|---|---|---|
| 1 Furniture | `furniture_set_description` | `furniture_value` |
| 2 Electronics | `fridge_or_electronics_desc` | `electronics_value` |
| 3 Washing machine | `washing_machine_desc` | `washing_machine_value` |
| 4 Gold | `gold_ornaments_weight_carat` + `qty` | `gold_market_value` |
| 5 Crockery | `crockery_and_kitchenware` | `crockery_value` |
| 6 Bedding | `bedding_quilts_and_linen` + `qty` | `bedding_value` |
| 7 Clothes | `bridal_dresses_and_clothes` + `qty` | `clothes_value` |
| 8 Misc | `miscellaneous_household_items` | `misc_value` |
| Subtotal Jahez | — | `total_dowry_value` |
| 9 Bari gold | `bari_gold_ornaments_desc` + `qty` | `bari_gold_value` |
| 10 Bari dresses | `bari_dresses_and_apparel` | `bari_dresses_value` |
| Subtotal Bari | — | `total_bari_value` |
| Grand total | — | `grand_total_combined_value` |

### 9.5 Custody Sec. 25 — extra fields

`children_details`, `custody_loss_date`, `cause_of_action_date`  
**Caption:** Petitioner vs Respondent  
**Prayer:** Permanent physical custody (Hizanat)

### 9.6 Restitution — extra fields

`marriage_date`, `departure_date`, `panchayat_date`, `cause_of_action_date`  
**Prayer:** Return to matrimonial home as lawful wife

---

## 10. Tool 5 — Revenue Applications Writer

**Law:** West Pakistan Land Revenue Act 1967  
**Attachments checklist:** Fard Malkiyat / Jamabandi | Khasra Girdawari | Aksi Shajra  

**Process note:** Application → Collector report → field verification (Patwari/Kanungo) → spot inspection → orders → appeal/revision (Sec. 161–164)

**Dropdown:**

1. Correction of revenue record — Sec. 45 / 53  
2. Demarcation (Hadd Bandi) — Sec. 117  
3. Ejectment / possession — Sec. 85 / 122  
4. Mutation disputes (Intiqal) — Sec. 42  
5. Partition of agricultural land — Sec. 135  
   - Naksha Alif → Naksha Be (Tareeqa-e-Takseem) → Naksha Jeem (Sanad-e-Takseem)  
   - Instrument of Partition Sec. 145  
   - If title dispute (Sec. 141): stay; refer to Civil Court  

---

## 11. Tool 6 — FBR / SECP Practice Hub

Guides only — **no** portal passwords or filing from this site.

**A. FBR IRIS 2.0** (`iris.fbr.gov.pk`)  
Maloomat / SSO | ITR Sec. 114 | Wealth Sec. 116 | Sales Tax / IMS | PSID / ATL | Exemption Sec. 153/159

**B. SECP eZfile** (`eservices.secp.gov.pk`)  
User registration | Name reservation | MoA/AoA | Forms 1, 21, 29 | NTN/EOBI/PESSI note

**C. Partnership firm**  
Deed → Form A/B → Form C → FBR AOP via IRIS

**D. Research links**

| Scope | Portal |
|---|---|
| Income Tax / SROs | fbr.gov.pk |
| Sales Tax / STGOs | fbr.gov.pk |
| IRIS manuals / SOPs | e.fbr.gov.pk |
| Companies Act / Regulations | secp.gov.pk |
| Official Gazette | pcp.gov.pk |

---

## 12. Design direction

- Professional Pakistan district-court firm look  
- Deep navy + warm paper-tone petition areas  
- Serif court headings  
- Brand-first hero (firm / advocate name dominant)  
- Tools hub + **drafting portal** grouped: Criminal | Family | Civil–Revenue | Tax–Corporate  
- First viewport: brand, one headline, one supporting line, CTA group, one dominant visual — not a dashboard of cards  

---

## 13. Implementation phases (historical → done)

1. Scaffold + firm contact config — **done**  
2. Marketing pages + lead capture — **done**  
3. Admin (login, leads, usage, CRUD) — **done**  
4. Criminal Trial Referencer + Criminal Applications Writer (expanded to 25) — **done**  
5. Civil Suit Writer — **done**  
6. Family Suit Writer (5 + Annexure-B + maintenance-only) — **done**  
7. Revenue Applications Writer — **done**  
8. FBR / SECP Practice Hub — **done**  
9. Polish (portal shell, module forms, `.docx` API, WhatsApp links) — **in place / ongoing**  

---

## 14. Out of scope (still)

- Login or filing on IRIS / eZfile from this website  
- Online payments  
- Client case file management  
- Full Urdu RTL petitions  
- AI free-form drafting  
- Multi-advocate accounts  
- Auto court-fee / stamp-duty calculation  

---

## 15. Template inventory (on disk)

```
templates/family/
  khula-dissolution.txt
  dower-maintenance-recovery.txt
  dowry-articles-recovery.txt
  dowry-annexure-b.txt
  custody-guardians-wards-s25.txt
  restitution-conjugal-rights.txt

templates/criminal/
  *.txt  (module text templates)
  *.docx (some dual copies)
  docx/  (paired Word files per module)
```

Key libs: `lib/criminal.ts`, `lib/criminalModuleFields.ts`, `lib/criminal-docx.ts`, `lib/family.ts`, `lib/maintenance.ts`, `lib/civil.ts`, `lib/revenue.ts`, `lib/writerClient.ts`, `lib/writerFormMap.ts`, `lib/auth.ts`, `lib/firm.ts`

---

## 16. Saved deliverable

- Markdown master: `WARIS-LAW-FIRM-COMPLETE-PLAN.md`  
- PDF export: `Waris-Law-Firm-Website-Plan.pdf` (project root)  

---

*End of Waris Law Firm Complete Project Plan (refreshed to implemented reality)*
