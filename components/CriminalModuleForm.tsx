"use client";

import {
  PortalField,
  PortalFormShell,
  portalInputClass,
  spanClass,
} from "@/components/PortalFormShell";
import {
  criminalModuleMeta,
  type ModuleFieldDef,
} from "@/lib/criminalModuleFields";
import type { CriminalAppType, CriminalForm } from "@/lib/criminal";

type Props = {
  appType: CriminalAppType;
  form: CriminalForm;
  update: <K extends keyof CriminalForm>(key: K, value: CriminalForm[K]) => void;
  onGenerate: () => void | Promise<void>;
  onPrint: () => void | Promise<void>;
  onClear: () => void;
  submitting?: boolean;
  error?: string;
};

function FieldControl({
  def,
  form,
  update,
}: {
  def: ModuleFieldDef;
  form: CriminalForm;
  update: Props["update"];
}) {
  const kind = def.kind ?? "text";
  const value = form[def.key];

  if (kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 pt-6 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => update(def.key, e.target.checked as never)}
          className="rounded border-slate-500"
        />
        <span>{def.label}</span>
      </label>
    );
  }

  if (kind === "textarea") {
    return (
      <PortalField label={def.label}>
        <textarea
          rows={3}
          className={portalInputClass}
          value={String(value ?? "")}
          placeholder={def.placeholder}
          onChange={(e) => update(def.key, e.target.value as never)}
        />
      </PortalField>
    );
  }

  if (kind === "select") {
    return (
      <PortalField label={def.label}>
        <select
          className={portalInputClass}
          value={String(value ?? "")}
          onChange={(e) => update(def.key, e.target.value as never)}
        >
          {(def.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </PortalField>
    );
  }

  return (
    <PortalField label={def.label}>
      <input
        type={kind === "date" || kind === "time" ? kind : "text"}
        className={portalInputClass}
        value={String(value ?? "")}
        placeholder={def.placeholder}
        onChange={(e) => update(def.key, e.target.value as never)}
      />
    </PortalField>
  );
}

export function CriminalModuleForm({
  appType,
  form,
  update,
  onGenerate,
  onPrint,
  onClear,
  submitting,
  error,
}: Props) {
  const meta = criminalModuleMeta[appType];

  return (
    <PortalFormShell
      badge={meta.badge}
      tone={meta.tone}
      title={meta.title}
      description={meta.description}
      submitLabel={meta.submitLabel}
      onSubmit={onGenerate}
      onPrint={onPrint}
      onClear={onClear}
      submitting={submitting}
      error={error}
    >
      <div className="grid gap-4 sm:grid-cols-4">
        {meta.fields.map((def) => (
          <div key={`${appType}-${String(def.key)}-${def.label}`} className={spanClass(def.span)}>
            <FieldControl def={def} form={form} update={update} />
          </div>
        ))}
      </div>
    </PortalFormShell>
  );
}
