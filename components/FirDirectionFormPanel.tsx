"use client";

/**
 * Thin wrapper kept for compatibility. Prefer CriminalModuleForm for all types.
 */
import { CriminalModuleForm } from "@/components/CriminalModuleForm";
import type { CriminalForm } from "@/lib/criminal";

type Props = {
  form: CriminalForm;
  update: <K extends keyof CriminalForm>(key: K, value: CriminalForm[K]) => void;
  onCompileDocx: () => void | Promise<void>;
  onPrint: () => void | Promise<void>;
  onClear: () => void;
  compiling?: boolean;
};

export function FirDirectionFormPanel({
  form,
  update,
  onCompileDocx,
  onPrint,
  onClear,
  compiling,
}: Props) {
  return (
    <CriminalModuleForm
      appType="22A-22B"
      form={form}
      update={update}
      onGenerate={onCompileDocx}
      onPrint={onPrint}
      onClear={onClear}
      submitting={compiling}
    />
  );
}
