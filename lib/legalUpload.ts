import { mkdir, readdir, stat, writeFile } from "fs/promises";
import path from "path";

/** Mirrors Express multer diskStorage destination: uploads/legal_case_vault */
export const LEGAL_VAULT_RELATIVE_DIR = path.join("uploads", "legal_case_vault");

export const LEGAL_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const LEGAL_MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export const INVALID_DOCUMENT_FORMAT_MESSAGE =
  "Invalid document format. Only PDF, DOCX, and JPG/PNG scanned files are permitted.";

export type LegalMimeType = (typeof LEGAL_MIME_TYPES)[number];

export type VaultFileInfo = {
  filename: string;
  relativePath: string;
  size: number;
  modifiedAt: string;
};

export function getVaultDirectory(): string {
  return path.resolve(process.cwd(), LEGAL_VAULT_RELATIVE_DIR);
}

export async function ensureVaultDirectory(): Promise<string> {
  const dir = getVaultDirectory();
  await mkdir(dir, { recursive: true });
  return dir;
}

/** Same sanitization as multer filename: replace non [a-zA-Z0-9.] with _ */
export function sanitizeOriginalFilename(originalName: string): string {
  return originalName.replace(/[^a-zA-Z0-9.]/g, "_");
}

/** Same unique prefix pattern as multer: Date.now()-random_cleanOriginalName */
export function buildUniqueVaultFilename(originalName: string): string {
  const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const cleanOriginalName = sanitizeOriginalFilename(originalName);
  return `${uniquePrefix}_${cleanOriginalName}`;
}

export function isAllowedLegalMime(mime: string): mime is LegalMimeType {
  return (LEGAL_MIME_TYPES as readonly string[]).includes(mime);
}

export function assertLegalUploadMeta(mime: string, size: number): void {
  if (!isAllowedLegalMime(mime)) {
    throw new Error(INVALID_DOCUMENT_FORMAT_MESSAGE);
  }
  if (size > LEGAL_MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds the 15MB size limit.");
  }
}

export async function saveEvidenceToVault(file: File): Promise<{
  savedFilename: string;
  absoluteVaultPath: string;
  relativePath: string;
  size: number;
  mime: string;
}> {
  assertLegalUploadMeta(file.type || "", file.size);

  const vaultDir = await ensureVaultDirectory();
  const savedFilename = buildUniqueVaultFilename(file.name || "evidence.bin");
  const absoluteVaultPath = path.join(vaultDir, savedFilename);
  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength > LEGAL_MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds the 15MB size limit.");
  }

  await writeFile(absoluteVaultPath, buffer);

  return {
    savedFilename,
    absoluteVaultPath,
    relativePath: path.join(LEGAL_VAULT_RELATIVE_DIR, savedFilename).replace(/\\/g, "/"),
    size: buffer.byteLength,
    mime: file.type,
  };
}

export async function listVaultFiles(): Promise<VaultFileInfo[]> {
  const vaultDir = await ensureVaultDirectory();
  const names = await readdir(vaultDir);
  const rows: VaultFileInfo[] = [];

  for (const filename of names) {
    const absolutePath = path.join(vaultDir, filename);
    const info = await stat(absolutePath);
    if (!info.isFile()) continue;
    rows.push({
      filename,
      relativePath: path.join(LEGAL_VAULT_RELATIVE_DIR, filename).replace(/\\/g, "/"),
      size: info.size,
      modifiedAt: info.mtime.toISOString(),
    });
  }

  rows.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));
  return rows;
}
