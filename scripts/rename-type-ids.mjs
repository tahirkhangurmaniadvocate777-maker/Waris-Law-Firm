import fs from "node:fs";

const files = [
  "lib/criminal.ts",
  "lib/criminalModuleFields.ts",
  "lib/writerFormMap.ts",
  "components/DraftingPortalShell.tsx",
];

const quoted = [
  ['"PARADE"', '"ID-PARADE"'],
  ['"DISCHARGE"', '"DISCHARGE-63"'],
  ['"HABEAS"', '"HABEAS-491"'],
  ['"RECALL-540"', '"WITNESS-RECALL-540"'],
  ['"ELEC-EVIDENCE"', '"E-EVIDENCE-164"'],
  ['"BAIL-CANCEL"', '"BAIL-CANCEL-497"'],
];

// Bare object keys (COURT_DEFAULTS / Record)
const bareKeys = [
  [/\bPARADE:/g, '"ID-PARADE":'],
  [/\bDISCHARGE:/g, '"DISCHARGE-63":'],
  [/\bHABEAS:/g, '"HABEAS-491":'],
  // already-quoted variants that may remain after partial renames
  [/"RECALL-540":/g, '"WITNESS-RECALL-540":'],
  [/"ELEC-EVIDENCE":/g, '"E-EVIDENCE-164":'],
  [/"BAIL-CANCEL":/g, '"BAIL-CANCEL-497":'],
];

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  for (const [from, to] of quoted) s = s.split(from).join(to);
  for (const [re, to] of bareKeys) s = s.replace(re, to);
  if (s !== before) {
    fs.writeFileSync(file, s);
    console.log("updated", file);
  } else {
    console.log("unchanged", file);
  }
}
