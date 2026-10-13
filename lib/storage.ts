import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export async function appendRecord(filename: string, record: unknown) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, filename);
  let rows: unknown[] = [];

  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    if (Array.isArray(parsed)) rows = parsed;
  } catch {
    rows = [];
  }

  rows.push(record);
  await writeFile(file, JSON.stringify(rows, null, 2), "utf8");
}
