/**
 * Reference port of the Express/multer legal upload engine.
 *
 * Express original (conceptual):
 * - destination: uploads/legal_case_vault (mkdir recursive)
 * - filename: `${Date.now()}-${random}_${sanitizedOriginal}`
 * - sanitize: originalname.replace(/[^a-zA-Z0-9.]/g, '_')
 * - MIME allowlist: PDF, JPEG, PNG, DOCX
 * - limits.fileSize: 15 * 1024 * 1024
 *
 * Next.js App Router cannot mount multer the same way. Runtime behavior lives in
 * `lib/legalUpload.ts` and is consumed by `POST /api/v1/vault/upload-evidence`
 * (multipart field: `evidence_file`). Auth: admin session cookie via `lib/auth`.
 *
 * Marketing response copy may say "encrypted"; at-rest encryption is not applied
 * in this port — files are stored as uploaded bytes on disk under the vault dir.
 */

export {
  LEGAL_VAULT_RELATIVE_DIR as uploadDirectory,
  LEGAL_MIME_TYPES as legalMimeTypes,
  LEGAL_MAX_FILE_SIZE_BYTES as fileSizeLimit,
  INVALID_DOCUMENT_FORMAT_MESSAGE,
  sanitizeOriginalFilename,
  buildUniqueVaultFilename,
  isAllowedLegalMime,
  ensureVaultDirectory,
  saveEvidenceToVault,
} from "@/lib/legalUpload";
