"use client";

import type { ChangeEvent } from "react";
import {
  fieldsForFamilySuit,
  familyFormKeyForFieldId,
  type FamilyFieldDef,
  type FamilySchemaSuitKey,
} from "@/lib/config/familyFormSchema";
import { Field, inputClass } from "@/lib/ui";

type Props = {
  suitKey: FamilySchemaSuitKey;
  /** Current form values keyed by FamilyForm camelCase properties. */
  values: Record<string, string>;
  onChange: (formKey: string, value: string) => void;
};

function FieldControl({
  def,
  value,
  onChange,
}: {
  def: FamilyFieldDef;
  value: string;
  onChange: (value: string) => void;
}) {
  const shared = {
    id: def.id,
    name: def.id,
    className: inputClass,
    value,
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => onChange(e.target.value),
  };

  if (def.type === "textarea") {
    return (
      <Field label={def.label}>
        <textarea {...shared} rows={4} placeholder={def.placeholder} />
      </Field>
    );
  }

  if (def.type === "select") {
    return (
      <Field label={def.label}>
        <select {...shared}>
          <option value="">Select…</option>
          {(def.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  return (
    <Field label={def.label}>
      <input
        {...shared}
        type={def.type === "number" ? "number" : def.type === "date" ? "date" : "text"}
        placeholder={def.placeholder}
      />
    </Field>
  );
}

/** Renders SHARED_FAMILY_FIELDS + EXTRA_SUIT_FIELDS[suitKey] as Tailwind inputs. */
export function FamilyDynamicForm({ suitKey, values, onChange }: Props) {
  const fields = fieldsForFamilySuit(suitKey);

  return (
    <div className="grid gap-4">
      {fields.map((def) => {
        const formKey = familyFormKeyForFieldId(def.id);
        if (!formKey) return null;
        return (
          <FieldControl
            key={def.id}
            def={def}
            value={values[formKey] ?? ""}
            onChange={(v) => onChange(formKey, v)}
          />
        );
      })}
    </div>
  );
}
